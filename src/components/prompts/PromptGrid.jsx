import PromptCard from "./PromptCard";

function PromptGrid({ prompts }) {
  return (
    <div className="library-grid">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          id={prompt.id}
          title={prompt.title}
          description={prompt.description}
          prompt={prompt.prompt}
          category={prompt.category}
          tags={prompt.tags || []}
          usageCount={prompt.usageCount || 0}
        />
      ))}
    </div>
  );
}

export default PromptGrid;