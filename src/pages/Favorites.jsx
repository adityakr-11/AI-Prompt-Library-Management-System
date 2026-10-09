import { Heart } from "lucide-react";

import PromptGrid from "../components/prompts/PromptGrid";
import { useFavorites } from "../context/FavoritesContext";
import { usePrompts } from "../context/PromptContext";

function Favorites() {
  const {
    favorites,
    loading: favoritesLoading,
  } = useFavorites();

  const {
    prompts,
    loading: promptsLoading,
  } = usePrompts();

  const favoritePrompts = prompts.filter((prompt) =>
    favorites.includes(Number(prompt.id))
  );

  const loading =
    favoritesLoading || promptsLoading;

  if (loading) {
    return (
      <div className="empty-state">
        <h3>Loading favorites...</h3>
        <p>Please wait while your saved prompts load.</p>
      </div>
    );
  }

  return (
    <div className="prompts-page">

      <div className="prompts-page-header">

        <div>
          <h2>Favorites</h2>

          <p>
            Your saved AI prompts.
          </p>
        </div>

        <div className="favorites-count">
          <Heart size={17} />
          {favoritePrompts.length} saved
        </div>

      </div>

      {favoritePrompts.length === 0 ? (
        <div className="empty-state">

          <Heart size={34} />

          <h3>No favorites yet</h3>

          <p>
            Click the heart on any prompt to save it here.
          </p>

        </div>
      ) : (
        <PromptGrid prompts={favoritePrompts} />
      )}

    </div>
  );
}

export default Favorites;