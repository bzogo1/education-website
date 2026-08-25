const articles = [
	{
		category: "CodePen Radio",
		timeAgo: "May 12, 2026",
		title: "#425: Debug Logs",
		image: "https://picsum.photos/300"
	},
	{
		category: "CSS Tip",
		timeAgo: "May 6, 2026",
		title: "Control the Speed of Infinite Animations",
		image: "https://picsum.photos/300"
	},
	{
		category: "Frontend Masters Blog",
		timeAgo: "April 6, 2026",
		title: "Let's Get Puzzled",
		image: "https://picsum.photos/300"
	},
	{
		category: "Butler's Log",
		timeAgo: ">March 19, 2026",
		title: "The Great CSS Expansion",
		image: "https://picsum.photos/300"
	},
	{
		category: "Una Kravets Blog",
		timeAgo: "February 19, 2026",
		title: "border-shape: the future of the non-rectangular web",
		image: "https://picsum.photos/300"
	}
];

const secondArticles = [
	{
		category: "nerdy.dev",
		timeAgo: "ebruary 3, 2026",
		title: "border-shape: the future of the non-rectangular web",
		image: "https://picsum.photos/300"
	},
	{
		category: "Dave Rupert Archives",
		timeAgo: "January 9, 2025",
		title: "Using your design system colors with contrast-color()",
		image: "https://picsum.photos/300"
	},
	{
		category: "Always Twisted",
		timeAgo: "October 22, 2025",
		title: "Styling The gap with CSS",
		image: "https://picsum.photos/300"
	},
	{
		category: "Polypane Blog",
		timeAgo: "September 15, 2025",
		title: "CSS-only floating focus with anchor positioning",
		image: "https://picsum.photos/300"
	},
	{
		category: "bell.bz",
		timeAgo: "January 30, 2026",
		title: "Fun shadow coding challenge",
		image: "https://picsum.photos/300"
	},
	{
		category: "CSS Tricks",
		timeAgo: "May 14, 2026",
		title: "Computing and Displaying Discounted Prices in CSS",
		image: "https://picsum.photos/300"
	}
];

const container = document.getElementById("news-container");
const secondContainer = document.getElementById("second-news-container");

const articlesHTML = articles
	.map((article, index) => {
		let lastIndex = index === articles.length - 1;
		return `
      <a href="https://www.jakebogan.com" class="flex items-center py-6 gap-2 px-2 hover:bg-white/10 transition-colors duration-300 ${
							lastIndex ? "" : "border-b border-white/30"
						}">
          <div class="flex-1 space-y-3">
              <p class="text-xs">
                  ${article.category}
                  <span class="opacity-50">• ${article.timeAgo}</span>
              </p>
              <h3 class="leading-5">
                  ${article.title}
              </h3>
          </div>
          <img src="${article.image}?random=${index}" alt="${
			article.title
		}" class="rounded-lg h-18 object-fill aspect-square select-none pointer-events-none" />
      </a>
    `;
	})
	.join("");

const secondArticlesHTML = secondArticles
	.map((article, index) => {
		let lastIndex = index === secondArticles.length - 1;
		return `
      <a href="https://www.jakebogan.com" class="block py-6 space-y-3 px-2 hover:bg-white/10 transition-colors duration-300 ${
							lastIndex ? "" : "border-b border-white/30"
						}">
          <p class="text-xs">
              ${article.category}
              <span class="opacity-50">• ${article.timeAgo}</span>
          </p>
          <h3 class="leading-5">
              ${article.title}
          </h3>
      </a>
    `;
	})
	.join("");

container.innerHTML = articlesHTML;
secondContainer.innerHTML = secondArticlesHTML;
