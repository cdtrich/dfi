export function sidebar() {
  const basePath = window.location.pathname.includes("/dfi") ? "/dfi" : "";

  const container = document.createElement("div");
  container.innerHTML = `
    <div class="sidebar" id="sidebar">
      <div class="sidebar-content">
        <button class="toggle-btn" id="toggleBtn">
          <!-- <i class="fas fa-chevron-left"></i> -->
        </button>
        <ul class="sidebar-menu">
          <li>
            <a href="${basePath}/index">
              <i class="fas fa-globe"></i>
              <span>Map</span>
            </a>
          </li>
          <li>
            <a href="${basePath}/countries">
              <i class="fas fa-flag"></i>
              <span>Countries</span>
            </a>
          </li>
          <li>
            <a href="${basePath}/directions">
              <i class="fas fa-rainbow"></i>
              <span>Directions</span>
            </a>
          </li>
          <li>
            <a href="${basePath}/perspectives">
              <i class="fas fa-comments"></i>
              <span>Perspectives</span>
            </a>
          </li>
          <li>
            <a href="${basePath}/methodology">
              <i class="fas fa-tools"></i>
              <span>Methodology</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `;

  const sidebarEl = container.querySelector("#sidebar");
  const toggleBtn = container.querySelector("#toggleBtn");

  // Function to check if device is mobile
  function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  // Initialize sidebar state based on device type
  function setSidebarState() {
    if (isMobile()) {
      sidebarEl.classList.add("collapsed");
    } else {
      sidebarEl.classList.remove("collapsed");
    }
  }

  // Toggle sidebar on button click
  toggleBtn.addEventListener("click", function () {
    sidebarEl.classList.toggle("collapsed");
  });

  function highlightCurrentPage() {
    const currentPath = window.location.pathname.replace(basePath, "") || "/";

    const links = container.querySelectorAll(".sidebar-menu a");

    links.forEach((link) => {
      const href = link.getAttribute("href").replace(basePath, "");

      if (
        (href === "/index" &&
          (currentPath === "/" || currentPath === "/index")) ||
        (href === "/countries" && currentPath.startsWith("/countries")) ||
        (href === "/directions" && currentPath.startsWith("/directions")) ||
        (href === "/perspectives" && currentPath.startsWith("/perspectives")) ||
        (href === "/methodology" && currentPath.startsWith("/methodology"))
      ) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Initialize
  setSidebarState();
  highlightCurrentPage();

  // Reinitialize when window is resized
  window.addEventListener("resize", setSidebarState);

  return container.firstElementChild;
}
