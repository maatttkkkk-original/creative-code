document.addEventListener("DOMContentLoaded", function () {
  // Settings variables with default values
  const settings = {
    background: {
      redditSource: "selfie", // Default subreddit for initial load
      overlayColor: "#000000",
      overlayOpacity: 0.3,
    },
    typography: {
      color: "#FFFFFF",
      opacity: 0.9,
      size: 100,
      text: "",
    },
  };

  // Background images array
  let backgroundImages = [];

  // Reddit sources - Categorized by SFW and NSFW
  const redditSources = {
    sfw: [
      "selfie",
      "amihot",
      "faces",
      "FreeCompliments",
      "progresspics",
      "rateme",
      "Ratemeteen",
      "amiugly",
      "firstimpression",
      "MODELING",
      "bodybuildingpics",
      "FitAndNatural",
    ],
    nsfw: [
      "gonewild",
      "RealGirls",
      "GoneWildPlus",
      "AsiansGoneWild",
      "GoneMild",
      "GirlsGoneMild",
      "ladybonersgw",
    ],
  };

  // Additional backup subreddits
  const backupSubreddits = [
    "portraits",
    "redditgetsdrawn",
    "EqualAttraction",
    "normalnudes",
    "glasses",
    "beards",
    "MakeupAddiction",
    "malehairadvice",
    "femalehairadvice",
    "malefashionadvice",
    "femalefashionadvice",
  ];

  // Fallback images for each category
  const fallbackImages = {
    selfie: [
      {
        url: "https://i.imgur.com/RwdyuJa.jpg",
        name: "Selfie portrait",
        type: "people",
        category: "selfie",
      },
      {
        url: "https://i.imgur.com/fecYdQ2.jpg",
        name: "Self portrait",
        type: "people",
        category: "selfie",
      },
    ],
  };

  // Add fallback images for all categories
  [...redditSources.sfw, ...redditSources.nsfw, ...backupSubreddits].forEach(
    (subreddit) => {
      if (!fallbackImages[subreddit]) {
        fallbackImages[subreddit] = [
          {
            url: "https://i.imgur.com/RwdyuJa.jpg",
            name: `${subreddit} portrait`,
            type: "people",
            category: subreddit,
          },
          {
            url: "https://i.imgur.com/fecYdQ2.jpg",
            name: `${subreddit} portrait`,
            type: "people",
            category: subreddit,
          },
        ];
      }
    }
  );

  // Track images by subreddit
  let allSubredditImages = {};
  let triedSubreddits = new Set();

  // IDENTITY-FOCUSED Keywords for all image types
  const imageKeywords = {
    people: [
      "IDENTITY",
      "SELF",
      "PERSONHOOD",
      "INDIVIDUALITY",
      "SELFHOOD",
      "PERSONALITY",
      "CHARACTER",
      "NATURE",
      "AUTHENTIC",
      "GENUINE",
      "REAL",
      "TRUE",
      "HONEST",
      "SINCERE",
      "ACTUAL",
      "LEGITIMATE",
      "UNIQUE",
      "DISTINCT",
      "SINGULAR",
      "INDIVIDUAL",
      "SPECIAL",
      "PARTICULAR",
      "SPECIFIC",
      "EXCLUSIVE",
      "BELONGING",
      "MEMBERSHIP",
      "AFFILIATION",
      "ASSOCIATION",
      "ATTACHMENT",
      "CONNECTION",
      "RELATIONSHIP",
      "BOND",
      "CULTURAL",
      "ETHNIC",
      "RACIAL",
      "NATIONAL",
      "RELIGIOUS",
      "LINGUISTIC",
      "COMMUNAL",
      "SOCIAL",
      "GENDER",
      "SEX",
      "SEXUALITY",
      "ORIENTATION",
      "EXPRESSION",
      "PRESENTATION",
      "PERFORMANCE",
      "EMBODIMENT",
      "PERSONAL",
      "PRIVATE",
      "INTIMATE",
      "INTERNAL",
      "INNER",
      "INTRINSIC",
      "INHERENT",
      "INNATE",
      "EVOLVING",
      "CHANGING",
      "DEVELOPING",
      "GROWING",
      "MATURING",
      "SHIFTING",
      "TRANSFORMING",
      "BECOMING",
      "APPEARANCE",
      "BEAUTY",
      "AESTHETIC",
      "LOOK",
      "IMAGE",
      "VISAGE",
      "COUNTENANCE",
      "FEATURES",
      "PRESENCE",
      "AURA",
      "ESSENCE",
      "IMPRESSION",
      "PERCEPTION",
      "RECEPTION",
      "INTERPRETATION",
      "JUDGMENT",
      "CONFIDENCE",
      "ASSURANCE",
      "CERTAINTY",
      "CONVICTION",
      "BELIEF",
      "FAITH",
      "TRUST",
      "RELIANCE",
      "VULNERABILITY",
      "OPENNESS",
      "EXPOSURE",
      "REVELATION",
      "DISCLOSURE",
      "CONFESSION",
      "ADMISSION",
      "ACKNOWLEDGMENT",
      "DESIRE",
      "WANT",
      "WISH",
      "CRAVING",
      "YEARNING",
      "LONGING",
      "HUNGER",
      "THIRST",
      "ATTRACTION",
      "APPEAL",
      "ALLURE",
      "CHARM",
      "MAGNETISM",
      "PULL",
      "DRAW",
      "ENTICEMENT",
      "VALIDATION",
      "AFFIRMATION",
      "CONFIRMATION",
      "APPROVAL",
      "ACCEPTANCE",
      "RECOGNITION",
      "ACKNOWLEDGMENT",
      "ENDORSEMENT",
      "EXHIBITION",
      "DISPLAY",
      "SHOW",
      "DEMONSTRATION",
      "PRESENTATION",
      "REVELATION",
      "EXPOSURE",
      "MANIFESTATION",
    ],
    default: [
      "IDENTITY",
      "SELF",
      "BEING",
      "ESSENCE",
      "AUTHENTIC",
      "GENUINE",
      "REAL",
      "TRUE",
      "PERSONA",
      "CHARACTER",
      "PERSONALITY",
      "NATURE",
      "TEMPERAMENT",
      "DISPOSITION",
      "ATTITUDE",
      "MINDSET",
      "UNIQUE",
      "INDIVIDUAL",
      "DISTINCT",
      "SINGULAR",
      "SPECIAL",
      "PARTICULAR",
      "SPECIFIC",
      "PERSONAL",
      "MEANING",
      "PURPOSE",
      "SIGNIFICANCE",
      "IMPORTANCE",
      "VALUE",
      "WORTH",
      "RELEVANCE",
      "MERIT",
      "HERITAGE",
      "ANCESTRY",
      "LINEAGE",
      "ROOTS",
      "ORIGIN",
      "BACKGROUND",
      "FOUNDATION",
      "SOURCE",
      "PERCEPTION",
      "CONCEPTION",
      "UNDERSTANDING",
      "INTERPRETATION",
      "PERSPECTIVE",
      "VIEWPOINT",
      "OUTLOOK",
      "STANCE",
      "EXPRESSION",
      "MANIFESTATION",
      "REPRESENTATION",
      "EMBODIMENT",
      "REFLECTION",
      "PROJECTION",
      "PORTRAYAL",
      "DEPICTION",
      "EVOLVING",
      "CHANGING",
      "DEVELOPING",
      "GROWING",
      "BECOMING",
      "TRANSFORMING",
      "SHIFTING",
      "ADAPTING",
    ],
  };

  // IDENTITY-FOCUSED prefixes and suffixes
  const phrasePrefixes = [
    "TRUE",
    "AUTHENTIC",
    "GENUINE",
    "REAL",
    "ESSENTIAL",
    "CORE",
    "INNER",
    "DEEP",
    "HIDDEN",
    "REVEALED",
    "DISCOVERED",
    "UNCOVERED",
    "EXPRESSED",
    "MANIFESTED",
    "EMBODIED",
    "REFLECTED",
    "PERSONAL",
    "INDIVIDUAL",
    "UNIQUE",
    "DISTINCT",
    "SINGULAR",
    "SPECIFIC",
    "PARTICULAR",
    "SPECIAL",
    "EVOLVING",
    "CHANGING",
    "DEVELOPING",
    "GROWING",
    "BECOMING",
    "TRANSFORMING",
    "SHIFTING",
    "ADAPTING",
    "CULTURAL",
    "SOCIAL",
    "COMMUNAL",
    "COLLECTIVE",
    "SHARED",
    "COMMON",
    "UNIVERSAL",
    "GLOBAL",
    "ANCESTRAL",
    "INHERITED",
    "GENERATIONAL",
    "TRADITIONAL",
    "HISTORICAL",
    "TIMELESS",
    "ENDURING",
    "LASTING",
    "CONSCIOUS",
    "AWARE",
    "MINDFUL",
    "INTENTIONAL",
    "DELIBERATE",
    "PURPOSEFUL",
    "MEANINGFUL",
    "SIGNIFICANT",
    "FLUID",
    "DYNAMIC",
    "FLEXIBLE",
    "ADAPTABLE",
    "MALLEABLE",
    "CHANGEABLE",
    "VARIABLE",
    "VERSATILE",
    "VISIBLE",
    "EXPOSED",
    "PRESENTED",
    "DISPLAYED",
    "EXHIBITED",
    "SHOWCASED",
    "REVEALED",
    "MANIFESTED",
    "DESIRED",
    "WANTED",
    "SOUGHT",
    "CRAVED",
    "YEARNED",
    "LONGED",
    "HUNGERED",
    "THIRSTED",
    "ATTRACTIVE",
    "APPEALING",
    "ALLURING",
    "CHARMING",
    "MAGNETIC",
    "ENTICING",
    "CAPTIVATING",
    "ENGAGING",
    "CONFIDENT",
    "ASSURED",
    "CERTAIN",
    "CONVINCED",
    "SELF-ASSURED",
    "SELF-POSSESSED",
    "POISED",
    "COMPOSED",
    "VULNERABLE",
    "OPEN",
    "EXPOSED",
    "REVEALED",
    "DISCLOSED",
    "CONFESSED",
    "ADMITTED",
    "ACKNOWLEDGED",
    "VALIDATED",
    "AFFIRMED",
    "CONFIRMED",
    "APPROVED",
    "ACCEPTED",
    "RECOGNIZED",
    "ACKNOWLEDGED",
    "ENDORSED",
    "BEAUTIFUL",
    "AESTHETIC",
    "PLEASING",
    "ATTRACTIVE",
    "APPEALING",
    "HANDSOME",
    "PRETTY",
    "GORGEOUS",
    "PRESENT",
    "IMMEDIATE",
    "CURRENT",
    "EXISTING",
    "ACTUAL",
    "REAL",
    "TANGIBLE",
    "CONCRETE",
  ];

  const phraseSuffixes = [
    "IDENTITY",
    "SELF",
    "BEING",
    "ESSENCE",
    "NATURE",
    "CHARACTER",
    "PERSONALITY",
    "PERSONA",
    "TRUTH",
    "REALITY",
    "AUTHENTICITY",
    "GENUINENESS",
    "REALNESS",
    "ACTUALITY",
    "VALIDITY",
    "VERACITY",
    "EXPRESSION",
    "MANIFESTATION",
    "REPRESENTATION",
    "EMBODIMENT",
    "REFLECTION",
    "PROJECTION",
    "PORTRAYAL",
    "DEPICTION",
    "PERSPECTIVE",
    "VIEWPOINT",
    "OUTLOOK",
    "STANCE",
    "POSITION",
    "ATTITUDE",
    "MINDSET",
    "MENTALITY",
    "NARRATIVE",
    "STORY",
    "ACCOUNT",
    "CHRONICLE",
    "HISTORY",
    "BIOGRAPHY",
    "MEMOIR",
    "TESTIMONY",
    "MEANING",
    "PURPOSE",
    "SIGNIFICANCE",
    "IMPORTANCE",
    "VALUE",
    "WORTH",
    "RELEVANCE",
    "MERIT",
    "EXPERIENCE",
    "PERCEPTION",
    "CONCEPTION",
    "UNDERSTANDING",
    "INTERPRETATION",
    "CONSTRUCTION",
    "FORMULATION",
    "ARTICULATION",
    "BECOMING",
    "EVOLUTION",
    "DEVELOPMENT",
    "GROWTH",
    "TRANSFORMATION",
    "CHANGE",
    "SHIFT",
    "ADAPTATION",
    "APPEARANCE",
    "BEAUTY",
    "AESTHETIC",
    "LOOK",
    "IMAGE",
    "VISAGE",
    "COUNTENANCE",
    "FEATURES",
    "PRESENCE",
    "AURA",
    "ESSENCE",
    "IMPRESSION",
    "PERCEPTION",
    "RECEPTION",
    "INTERPRETATION",
    "JUDGMENT",
    "CONFIDENCE",
    "ASSURANCE",
    "CERTAINTY",
    "CONVICTION",
    "BELIEF",
    "FAITH",
    "TRUST",
    "RELIANCE",
    "VULNERABILITY",
    "OPENNESS",
    "EXPOSURE",
    "REVELATION",
    "DISCLOSURE",
    "CONFESSION",
    "ADMISSION",
    "ACKNOWLEDGMENT",
    "DESIRE",
    "WANT",
    "WISH",
    "CRAVING",
    "YEARNING",
    "LONGING",
    "HUNGER",
    "THIRST",
    "ATTRACTION",
    "APPEAL",
    "ALLURE",
    "CHARM",
    "MAGNETISM",
    "PULL",
    "DRAW",
    "ENTICEMENT",
    "VALIDATION",
    "AFFIRMATION",
    "CONFIRMATION",
    "APPROVAL",
    "ACCEPTANCE",
    "RECOGNITION",
    "ACKNOWLEDGMENT",
    "ENDORSEMENT",
    "EXHIBITION",
    "DISPLAY",
    "SHOW",
    "DEMONSTRATION",
    "PRESENTATION",
    "REVELATION",
    "EXPOSURE",
    "MANIFESTATION",
  ];

  // Get HTML elements
  const container = document.querySelector(".fullscreen-container");
  const loadingIndicator = document.getElementById("loading-indicator");

  // Create the main image element
  const bgImage = document.getElementById("bg-image");
  const bgColorOverlay = document.getElementById("bg-color-overlay");
  const textContainer = document.getElementById("text-container");

  // Create top navigation bar with all controls
  const { sourceDisplay, refreshImagesButton, nsfwTag } = createTopNavBar();

  // Current index and subreddit
  let currentBgIndex = 0;
  let currentSubreddit = "";
  let loadingTimeoutId = null;

  // Swipe variables
  let startX = 0;
  let isDragging = false;

  // Create top navigation bar
  function createTopNavBar() {
    // Create top navigation bar
    const topNavBar = document.createElement("div");
    topNavBar.className = "top-nav-bar";
    document.body.appendChild(topNavBar);

    // 1. NSFW tag (leftmost)
    const nsfwTag = document.createElement("div");
    nsfwTag.textContent = "Sometimes NSFW";
    nsfwTag.className = "nav-button nsfw-tag";
    topNavBar.appendChild(nsfwTag);

    // 2. Source display (subreddit)
    const sourceDisplay = document.createElement("div");
    sourceDisplay.id = "source-display";
    sourceDisplay.textContent = "Loading...";
    sourceDisplay.className = "nav-button source-display";
    topNavBar.appendChild(sourceDisplay);

    // 3. Dice button
    const refreshImagesButton = document.createElement("div");
    refreshImagesButton.id = "refresh-images";
    refreshImagesButton.innerHTML = "🎲";
    refreshImagesButton.className = "nav-button refresh-button";
    topNavBar.appendChild(refreshImagesButton);

    // 4. Navigation arrows (rightmost)
    const arrowsContainer = document.createElement("div");
    arrowsContainer.className = "nav-arrows-container";
    topNavBar.appendChild(arrowsContainer);

    // Left arrow
    const leftArrow = document.createElement("button");
    leftArrow.className = "nav-button nav-arrow";
    leftArrow.id = "prev-arrow";
    leftArrow.innerHTML = "←";
    leftArrow.setAttribute("aria-label", "Previous image");
    arrowsContainer.appendChild(leftArrow);

    // Right arrow
    const rightArrow = document.createElement("button");
    rightArrow.className = "nav-button nav-arrow";
    rightArrow.id = "next-arrow";
    rightArrow.innerHTML = "→";
    rightArrow.setAttribute("aria-label", "Next image");
    arrowsContainer.appendChild(rightArrow);

    // Add event listeners
    leftArrow.addEventListener("click", () => navigateImages(-1));
    rightArrow.addEventListener("click", () => navigateImages(1));

    // Dice button - change subreddit
    refreshImagesButton.addEventListener("click", async function () {
      // Show loading indicator
      loadingIndicator.style.display = "flex";

      // Set a timeout for fallback
      const refreshTimeoutId = setTimeout(() => {
        console.warn("Refresh timeout reached, using fallback images");
        useFallbackImages();
        loadingIndicator.style.display = "none";
      }, 10000);

      try {
        // Load new subreddit
        await loadRandomSubreddit();
        clearTimeout(refreshTimeoutId);
      } catch (error) {
        console.error("Error refreshing images:", error);
        useFallbackImages();
        clearTimeout(refreshTimeoutId);
      }

      // Hide loading indicator
      loadingIndicator.style.display = "none";
    });

    return { sourceDisplay, refreshImagesButton, nsfwTag };
  }

  // Initialize the slideshow
  async function initSlideshow() {
    // Show loading indicator
    loadingIndicator.style.display = "flex";

    // Set a timeout to use fallback images if loading takes too long
    loadingTimeoutId = setTimeout(() => {
      console.warn("Loading timeout reached, using fallback images");
      useFallbackImages();
      loadingIndicator.style.display = "none";
    }, 10000);

    // Set up event listeners
    setupEventListeners();

    try {
      // Load a random subreddit
      await loadRandomSubreddit();

      // Clear the timeout since loading succeeded
      if (loadingTimeoutId) {
        clearTimeout(loadingTimeoutId);
        loadingTimeoutId = null;
      }

      // Hide loading indicator
      loadingIndicator.style.display = "none";
    } catch (error) {
      console.error("Error during initialization:", error);
      useFallbackImages();

      if (loadingTimeoutId) {
        clearTimeout(loadingTimeoutId);
        loadingTimeoutId = null;
      }

      loadingIndicator.style.display = "none";
    }
  }

  // Load a random subreddit
  async function loadRandomSubreddit() {
    // Get all available subreddits
    const allSubreddits = [
      ...redditSources.sfw,
      ...(Math.random() < 0.1 ? redditSources.nsfw : []),
      ...backupSubreddits,
    ];

    // Shuffle and pick one that hasn't been tried yet
    shuffleArray(allSubreddits);

    let selectedSubreddit = null;
    for (const subreddit of allSubreddits) {
      if (!triedSubreddits.has(subreddit)) {
        selectedSubreddit = subreddit;
        break;
      }
    }

    // If all subreddits have been tried, reset and try again
    if (!selectedSubreddit) {
      triedSubreddits.clear();
      selectedSubreddit = allSubreddits[0];
    }

    console.log(`Loading subreddit: r/${selectedSubreddit}`);

    try {
      // Try to fetch images from this subreddit with a timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () =>
            reject(new Error(`Timeout fetching from r/${selectedSubreddit}`)),
          5000
        );
      });

      // Race the fetch against the timeout
      const images = await Promise.race([
        fetchRedditImages(selectedSubreddit),
        timeoutPromise,
      ]);

      if (images && images.length > 0) {
        // Successfully loaded images
        console.log(
          `Successfully loaded ${images.length} images from r/${selectedSubreddit}`
        );
        backgroundImages = images;
        currentSubreddit = selectedSubreddit;
        currentBgIndex = 0;

        // Set the first image
        setBackground(0);
        generateTypographyText();
        updateTypography();

        return true;
      } else {
        throw new Error(`No images found in r/${selectedSubreddit}`);
      }
    } catch (error) {
      console.error(`Error loading r/${selectedSubreddit}:`, error);
      triedSubreddits.add(selectedSubreddit);

      // Try another subreddit
      return loadRandomSubreddit();
    }
  }

  // Fetch Reddit images
  async function fetchRedditImages(subreddit) {
    try {
      // Try different sorting methods in order of reliability
      const sortMethods = ["new", "hot", "top"];

      for (const sortMethod of sortMethods) {
        try {
          // Add a timestamp to prevent caching
          const timestamp = new Date().getTime();
          const url = `https://www.reddit.com/r/${subreddit}/${sortMethod}.json?limit=25&t=${timestamp}`;

          console.log(`Fetching from ${url}`);

          // Create a promise that times out after 3 seconds
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(
              () => reject(new Error(`Timeout fetching from ${url}`)),
              3000
            );
          });

          // Race the fetch against the timeout
          const response = await Promise.race([fetch(url), timeoutPromise]);

          if (!response.ok) {
            console.warn(
              `Failed to fetch from r/${subreddit} with ${sortMethod} sort: ${response.status}`
            );
            continue; // Try next sort method
          }

          const data = await response.json();

          if (
            !data ||
            !data.data ||
            !data.data.children ||
            data.data.children.length === 0
          ) {
            console.warn(
              `No posts found in r/${subreddit} with ${sortMethod} sort`
            );
            continue; // Try next sort method
          }

          const posts = data.data.children;

          // Process posts to extract images
          const images = [];

          for (const post of posts) {
            try {
              // Skip if no data
              if (!post.data) continue;

              // Extract basic post data
              const postData = {
                author: post.data.author,
                title: post.data.title,
                link: post.data.url,
                thumbnail: post.data.thumbnail,
              };

              // Determine if this is an image post
              let imageUrl = null;

              // Check link for direct image URL (excluding Imgur)
              if (
                postData.link &&
                !postData.link.includes("imgur.com") &&
                (postData.link.endsWith(".jpg") ||
                  postData.link.endsWith(".jpeg") ||
                  postData.link.endsWith(".png") ||
                  postData.link.includes("i.redd.it"))
              ) {
                imageUrl = postData.link;
              }

              // If no image URL yet, check for preview images
              if (
                !imageUrl &&
                post.data.preview &&
                post.data.preview.images &&
                post.data.preview.images.length > 0 &&
                post.data.preview.images[0].source &&
                post.data.preview.images[0].source.url
              ) {
                imageUrl = post.data.preview.images[0].source.url.replace(
                  /&amp;/g,
                  "&"
                );
              }

              // If still no image URL, try the thumbnail if it's suitable
              if (
                !imageUrl &&
                postData.thumbnail &&
                postData.thumbnail.startsWith("http") &&
                !postData.thumbnail.includes("default") &&
                !postData.thumbnail.includes("nsfw") &&
                !postData.thumbnail.includes("self")
              ) {
                imageUrl = postData.thumbnail;
              }

              // If we found an image URL, add it to our collection
              if (imageUrl) {
                images.push({
                  url: imageUrl,
                  name: postData.title || `Image from r/${subreddit}`,
                  type: "people",
                  category: subreddit,
                });

                // Stop once we have enough images (increased to 10)
                if (images.length >= 10) {
                  break;
                }
              }
            } catch (postError) {
              console.warn(
                `Error processing post from r/${subreddit}:`,
                postError
              );
              // Continue to the next post
            }
          }

          // If we found enough images, return them
          if (images.length >= 2) {
            return images;
          }

          // Otherwise try the next sort method
          console.log(
            `Found only ${images.length} images in r/${subreddit} with ${sortMethod} sort, trying next sort method`
          );
        } catch (sortError) {
          console.warn(
            `Error with ${sortMethod} sort for r/${subreddit}:`,
            sortError
          );
          // Continue to the next sort method
        }
      }

      // If we get here, all sort methods failed
      throw new Error(
        `Could not find images in r/${subreddit} with any sort method`
      );
    } catch (error) {
      console.error(`Error fetching images from r/${subreddit}:`, error);
      throw error;
    }
  }

  // Shuffle an array using Fisher-Yates algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Use fallback images
  function useFallbackImages() {
    // Get a random subreddit from our list
    const allSubreddits = [...redditSources.sfw, ...backupSubreddits];
    const randomSubreddit =
      allSubreddits[Math.floor(Math.random() * allSubreddits.length)];

    console.log(`Using fallback images for r/${randomSubreddit}`);

    // Use its fallback images
    if (fallbackImages[randomSubreddit]) {
      backgroundImages = fallbackImages[randomSubreddit];
      currentSubreddit = randomSubreddit;
      currentBgIndex = 0;

      // Set the first image
      setBackground(0);
      generateTypographyText();
      updateTypography();
    } else {
      // Last resort - use selfie fallbacks
      backgroundImages = fallbackImages["selfie"];
      currentSubreddit = "selfie";
      currentBgIndex = 0;

      setBackground(0);
      generateTypographyText();
      updateTypography();
    }
  }

  // Navigate between images
  function navigateImages(direction) {
    // Calculate new index with wrap-around
    const newIndex =
      (currentBgIndex + direction + backgroundImages.length) %
      backgroundImages.length;

    // Add animation class to container
    container.classList.add("swiping");

    // Add the appropriate animation class based on direction
    if (direction > 0) {
      container.classList.add("swipe-left");
    } else {
      container.classList.add("swipe-right");
    }

    // Wait for animation to complete
    setTimeout(() => {
      // Update the background
      setBackground(newIndex);
      generateTypographyText();
      updateTypography();

      // Remove animation classes
      container.classList.remove("swiping", "swipe-left", "swipe-right");
    }, 300);
  }

  // Setup swipe detection
  function setupSwipeDetection() {
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
      },
      false
    );

    container.addEventListener(
      "touchend",
      function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      false
    );

    container.addEventListener(
      "mousedown",
      function (e) {
        touchStartX = e.screenX;
        document.addEventListener("mouseup", handleMouseUp, { once: true });
      },
      false
    );

    function handleMouseUp(e) {
      touchEndX = e.screenX;
      handleSwipe();
    }

    function handleSwipe() {
      const swipeThreshold = 50; // Minimum distance to register a swipe

      if (touchEndX < touchStartX - swipeThreshold) {
        // Swiped left - go to next image
        navigateImages(1);
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        // Swiped right - go to previous image
        navigateImages(-1);
      }
    }
  }

  // Set up event listeners
  function setupEventListeners() {
    // Image error handling
    bgImage.addEventListener("error", function () {
      console.error("Failed to load image:", this.src);

      // Try to find a fallback image for the current category
      if (
        fallbackImages[currentSubreddit] &&
        fallbackImages[currentSubreddit].length > 0
      ) {
        // Use a random fallback image from the same category
        const randomIndex = Math.floor(
          Math.random() * fallbackImages[currentSubreddit].length
        );
        this.src = fallbackImages[currentSubreddit][randomIndex].url;
      } else {
        // Last resort fallback
        this.src =
          "https://via.placeholder.com/1600x900/333333/FFFFFF?text=Image+Not+Available";
      }
    });

    // Setup swipe detection
    setupSwipeDetection();
  }

  // Set the background
  function setBackground(index) {
    currentBgIndex = index;

    // Get background data
    const background = backgroundImages[index];

    // Update background image
    bgImage.src = background.url;

    // Apply overlay settings
    bgColorOverlay.style.backgroundColor = settings.background.overlayColor;
    bgColorOverlay.style.opacity = settings.background.overlayOpacity;

    // Update source display
    sourceDisplay.textContent = `r/${currentSubreddit}`;
  }

  // Generate typography text based on current image
  function generateTypographyText() {
    const currentImage = backgroundImages[currentBgIndex];
    const imageType = currentImage.type || "people";

    // Get appropriate keywords for this image type
    const keywords = imageKeywords[imageType] || imageKeywords.default;

    // Randomly select components for the phrase
    const prefix =
      phrasePrefixes[Math.floor(Math.random() * phrasePrefixes.length)];
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const suffix =
      phraseSuffixes[Math.floor(Math.random() * phraseSuffixes.length)];

    // Create a phrase with varied formats for more diversity
    let phrase;
    const format = Math.random();

    if (format < 0.2) {
      // Format: PREFIX KEYWORD
      phrase = `${prefix} ${keyword}`;
    } else if (format < 0.4) {
      // Format: KEYWORD SUFFIX
      phrase = `${keyword} ${suffix}`;
    } else if (format < 0.6) {
      // Format: PREFIX KEYWORD SUFFIX
      phrase = `${prefix} ${keyword} ${suffix}`;
    } else if (format < 0.8) {
      // Format: Just the keyword, dramatic
      phrase = keyword;
    } else {
      // Format: Two keywords
      const secondKeyword =
        keywords[Math.floor(Math.random() * keywords.length)];
      if (keyword !== secondKeyword) {
        phrase = `${keyword} & ${secondKeyword}`;
      } else {
        phrase = keyword;
      }
    }

    // Store the generated text
    settings.typography.text = phrase;
  }

  // Update typography display with HTML/CSS instead of SVG
  function updateTypography() {
    const text = settings.typography.text;

    // Clear previous text
    textContainer.innerHTML = "";

    // Convert text to uppercase
    const upperText = text.toUpperCase();

    // Calculate appropriate font size based on text length
    // Longer text gets smaller font size
    let fontSize;
    if (upperText.length < 10) {
      fontSize = "8rem"; // Very short text
    } else if (upperText.length < 20) {
      fontSize = "6rem"; // Short text
    } else if (upperText.length < 40) {
      fontSize = "4.5rem"; // Medium text
    } else if (upperText.length < 80) {
      fontSize = "3.5rem"; // Long text
    } else {
      fontSize = "2.5rem"; // Very long text
    }

    // Create text element
    const textElement = document.createElement("div");
    textElement.className = "typography-text";
    textElement.textContent = upperText;
    textElement.style.fontSize = fontSize;
    textElement.style.opacity = settings.typography.opacity;

    // Add to container
    textContainer.appendChild(textElement);
  }

  // Start initialization with fallback in case of error
  try {
    initSlideshow();
  } catch (error) {
    console.error("Fatal error during initialization:", error);
    useFallbackImages();
    if (loadingIndicator) {
      loadingIndicator.style.display = "none";
    }
  }
});
