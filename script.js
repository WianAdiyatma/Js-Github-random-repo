const selectContainer = document.querySelector(".select-container");
const containerP = document.querySelector(".select-container p");
const languageSelector = document.querySelector(".select-lang");
const button = document.querySelector(".button");
const dropdown = document.querySelector(".dropdown");
const dropdownMenu = document.querySelectorAll(".dropdown p");
let selectedValue = null; // Set default value
button.classList.remove("err");

// Toggle dropdown visibility
selectContainer.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent immediate closing
  dropdown.classList.toggle("display");
});

// Close dropdown when clicking outside
document.addEventListener("click", () => {
  dropdown.classList.add("display");
});

// Handle language selection and fetch repos
dropdownMenu.forEach((menu) => {
  menu.addEventListener("click", (e) => {
    // Update displayed text
    containerP.textContent = menu.textContent.toLowerCase();

    // Update selected value
    selectedValue = menu.getAttribute("data-value");
    languageSelector.innerHTML = `<h3>Loading...</h3>`;
    console.log("Selected:", selectedValue);

    // Fetch repositories for the selected language
    
        fetchRepositories(selectedValue);
      
    });
  });


// Format numbers (e.g., 2500 → 2.5k)
function formatNumber(num) {
  if (num >= 1000) {
    const formatted = (num / 1000).toFixed(1);
    return formatted.endsWith(".0")
      ? formatted.slice(0, -2) + "k"
      : formatted + "k";
  }
  return num.toString();
}

// Fetch repositories function
function fetchRepositories(language) {
  if (!language) {
    console.error("No language selected");
    return;
  }

  $.ajax({
    url: `https://api.github.com/search/repositories?q=language:${encodeURIComponent(
      language
    )}`,
    success: (result) => {
      const repo = result.items;
      const random = Math.floor(Math.random() * repo.length);
      const getRepo = repo[random];

      languageSelector.innerHTML = `
                <div class="bold">
                    <h3>${getRepo.full_name}</h3>
                    <p>${
                      getRepo.description
                        ? getRepo.description.length > 100
                          ? `${getRepo.description.substring(0, 100)}...`
                          : getRepo.description
                        : "No description available"
                    }
                    </p>
                    <div class="detail">
                        <div style="display: flex; gap: 5px; align-items: center;">
                            <p class="circle"></p>
                            <p>${getRepo.language || "Unknown"}</p>
                        </div>
                        <div style="display: flex; gap: 5px; align-items: center;">
                            <img src="https://img.icons8.com/?size=100&id=7856&format=png&color=000000" alt="star-icon" style="width: 18px;">
                            <p>${formatNumber(getRepo.stargazers_count)}</p>
                            <div style="display: flex; gap: 5px; align-items: center;">
                                <img src="https://img.icons8.com/?size=100&id=79746&format=png&color=000000" alt="fork-icon" style="width: 20px;">
                                <p>${formatNumber(getRepo.forks_count)}</p>
                            </div>
                        </div>
                    </div>
                </div>`;
      const circle = document.querySelector(".circle");
      if (language === "Python") {
        circle.style.background = "limegreen";
      } else if (language === "ruby") {
        circle.style.background = "red";
      }
    },
    error: (e) => {
      console.log("Error:", e.responseText);
      languageSelector.innerHTML = `
        <h3>Error Fetching Repositories</h3>
            `;
      languageSelector.style.background = "lightcoral";
      button.textContent = "Click to retry";
      button.classList.add("err");
    },
  });
}

// Initial fetch with default language
fetchRepositories(selectedValue);

// Add this to your existing code
button.addEventListener("click", (e) => {
  button.classList.remove("err");
  e.preventDefault();

  // Show loading state immediately
  languageSelector.innerHTML = `<h3>Loading...</h3>`;

  // Check if we have a selected language
  if (!selectedValue) {
    console.log("Please select a language first");
    languageSelector.innerHTML = "Please select a language first!"; // Clear loading if no language selected
    return;
  }

  // Add 0.5s delay before fetching
  setTimeout(() => {
    fetchRepositories(selectedValue);
  }, 200); // 0.2s timeout
});
