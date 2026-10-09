import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const FavoritesContext = createContext(null);

const API_URL = "http://localhost:5001/api/favorites";

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH FAVORITES
  // =========================
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setFavorites([]);
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Fetch favorites error:", data.message);

        setFavorites([]);
        return;
      }

      const favoriteIds = (data.favorites || []).map(
        (id) => Number(id)
      );

      setFavorites(favoriteIds);
    } catch (error) {
      console.error("Fetch favorites error:", error);

      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD FAVORITES
  // =========================
  useEffect(() => {
    fetchFavorites();
  }, []);

  // =========================
  // CHECK IF FAVORITE
  // =========================
  const isFavorite = (promptId) => {
    const numericPromptId = Number(promptId);

    return favorites.includes(numericPromptId);
  };

  // =========================
  // TOGGLE FAVORITE
  // =========================
  const toggleFavorite = async (promptId) => {
    const numericPromptId = Number(promptId);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return false;
      }

      const alreadyFavorite =
        favorites.includes(numericPromptId);

      const response = await fetch(
        `${API_URL}/${numericPromptId}`,
        {
          method: alreadyFavorite ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Favorite API error:", data);

        alert(
          data.message ||
            "Unable to update favorite."
        );

        return false;
      }

      if (alreadyFavorite) {
        setFavorites((currentFavorites) =>
          currentFavorites.filter(
            (id) => id !== numericPromptId
          )
        );
      } else {
        setFavorites((currentFavorites) => [
          ...currentFavorites,
          numericPromptId,
        ]);
      }

      return true;
    } catch (error) {
      console.error(
        "Toggle favorite error:",
        error
      );

      alert(
        "Unable to connect to the backend."
      );

      return false;
    }
  };

  // =========================
  // CONTEXT VALUE
  // =========================
  const value = {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    fetchFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// =========================
// CUSTOM HOOK
// =========================
export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites must be used within a FavoritesProvider"
    );
  }

  return context;
}
