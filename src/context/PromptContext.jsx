import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const PromptContext = createContext(null);

const API_URL = "http://localhost:5001/api/prompts";
const USAGE_API_URL = "http://localhost:5001/api/usage";

export function PromptProvider({ children }) {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================================
  // GET PROMPTS
  // ========================================

  const fetchPrompts = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setPrompts([]);
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}`
        );
      }

      setPrompts(data.prompts || []);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // CREATE PROMPT
  // ========================================

  const addPrompt = async (newPrompt) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return null;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPrompt),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}`
        );
      }

      await fetchPrompts();

      return data;
    } catch (error) {
      console.error("Error creating prompt:", error);
      alert(error.message || "Unable to create prompt.");
      return null;
    }
  };

  // ========================================
  // UPDATE PROMPT
  // ========================================

  const updatePrompt = async (id, updatedPrompt) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return null;
      }

      console.log("Updating prompt:", id);
      console.log("Update data:", updatedPrompt);

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedPrompt.title,
          description: updatedPrompt.description,
          prompt: updatedPrompt.prompt,
          category: updatedPrompt.category,
          tags: Array.isArray(updatedPrompt.tags)
            ? updatedPrompt.tags
            : [],
        }),
      });

      const data = await response.json();

      console.log("Update response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}`
        );
      }

      // Refresh from MySQL so frontend always has
      // the latest database values.
      await fetchPrompts();

      return data;
    } catch (error) {
      console.error("Error updating prompt:", error);

      alert(
        `Unable to update prompt.\n\n${error.message}`
      );

      return null;
    }
  };

  // ========================================
  // DELETE PROMPT
  // ========================================

  const deletePrompt = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return false;
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}`
        );
      }

      setPrompts((prev) =>
        prev.filter(
          (prompt) => Number(prompt.id) !== Number(id)
        )
      );

      return true;
    } catch (error) {
      console.error("Error deleting prompt:", error);

      alert(
        `Unable to delete prompt.\n\n${error.message}`
      );

      return false;
    }
  };

  // ========================================
  // RECORD PROMPT COPY
  // ========================================

  const recordPromptCopy = async (promptId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return false;
      }

      const response = await fetch(USAGE_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt_id: Number(promptId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}`
        );
      }

      setPrompts((prev) =>
        prev.map((prompt) =>
          Number(prompt.id) === Number(promptId)
            ? {
                ...prompt,
                usage_count:
                  (Number(prompt.usage_count) || 0) + 1,
              }
            : prompt
        )
      );

      return true;
    } catch (error) {
      console.error(
        "Error recording prompt copy:",
        error
      );

      return false;
    }
  };

  // ========================================
  // FETCH USAGE
  // ========================================

  const fetchUsage = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return null;
      }

      const response = await fetch(USAGE_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching usage:", error);
      return null;
    }
  };

  // ========================================
  // LOAD PROMPTS
  // ========================================

  useEffect(() => {
    fetchPrompts();
  }, []);

  // ========================================
  // PROVIDER
  // ========================================

  return (
    <PromptContext.Provider
      value={{
        prompts,
        loading,
        fetchPrompts,
        addPrompt,
        updatePrompt,
        deletePrompt,
        recordPromptCopy,
        fetchUsage,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
}

// ========================================
// MAIN CONTEXT HOOK
// ========================================

export function usePromptContext() {
  const context = useContext(PromptContext);

  if (!context) {
    throw new Error(
      "usePromptContext must be used within a PromptProvider"
    );
  }

  return context;
}

// ========================================
// COMPATIBILITY HOOK
// ========================================

export function usePrompts() {
  return usePromptContext();
}