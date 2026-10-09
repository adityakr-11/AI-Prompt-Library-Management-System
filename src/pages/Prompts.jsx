import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PromptGrid from "../components/prompts/PromptGrid";
import { usePrompts } from "../context/PromptContext";

function Prompts() {
  const navigate = useNavigate();
  const { prompts, loading } = usePrompts();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [categories, setCategories] = useState([
    "All",
    "Programming",
    "Web Development",
    "Database",
    "Education",
    "Career",
    "AI",
    "Writing",
    "Other",
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5001/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (
          response.ok &&
          data.categories &&
          data.categories.length > 0
        ) {
          const categoryNames = data.categories
            .map((category) => category.category_name)
            .filter(Boolean);

          setCategories([
            "All",
            ...new Set(categoryNames),
          ]);
        }
      } catch (error) {
        console.log(
          "Category fetch fallback:",
          error.message
        );
      }
    };

    fetchCategories();
  }, []);

  const filteredPrompts = prompts.filter((prompt) => {
    const search = searchTerm.trim().toLowerCase();

    const title = String(prompt.title || "").toLowerCase();

    const description = String(
      prompt.description || ""
    ).toLowerCase();

    const category = String(
      prompt.category || ""
    ).toLowerCase();

    const tags = Array.isArray(prompt.tags)
      ? prompt.tags
      : [];

    const matchesSearch =
      search === "" ||
      title.includes(search) ||
      description.includes(search) ||
      category.includes(search) ||
      tags.some((tag) =>
        String(tag).toLowerCase().includes(search)
      );

    const promptCategory = String(
      prompt.category || ""
    )
      .trim()
      .toLowerCase();

    const selectedCategoryValue = String(
      selectedCategory || ""
    )
      .trim()
      .toLowerCase();

    const matchesCategory =
      selectedCategoryValue === "all" ||
      promptCategory === selectedCategoryValue;

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  return (
    <div className="prompts-page">

      <div className="prompts-page-header">
        <div>
          <h2>Prompt Library</h2>

          <p>
            Search, organize, and manage your AI prompts.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/add-prompt")}
        >
          <Plus size={18} />
          Add Prompt
        </button>
      </div>

      <div className="prompt-toolbar">

        <div className="prompt-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by title, description, or tags..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="category-filter">
          <SlidersHorizontal size={17} />

          <select
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category === "All"
                  ? "All Categories"
                  : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="prompt-results-header">
        {filteredPrompts.length}{" "}
        {filteredPrompts.length === 1
          ? "prompt"
          : "prompts"}{" "}
        found
      </div>

      {loading ? (
        <div className="empty-state">
          <h3>Loading prompts...</h3>
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="empty-state">
          <h3>No prompts found</h3>

          <p>
            {searchTerm ||
            selectedCategory !== "All"
              ? "Try adjusting your search filters."
              : "You haven't saved any prompts yet."}
          </p>

          {(searchTerm ||
            selectedCategory !== "All") && (
            <button
              className="primary-btn"
              style={{ marginTop: "16px" }}
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}

          {!searchTerm &&
            selectedCategory === "All" && (
              <button
                className="primary-btn"
                style={{ marginTop: "16px" }}
                onClick={() =>
                  navigate("/add-prompt")
                }
              >
                + Add New Prompt
              </button>
            )}
        </div>
      ) : (
        <PromptGrid prompts={filteredPrompts} />
      )}
    </div>
  );
}

export default Prompts;