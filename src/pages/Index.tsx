
import React, { useState, useEffect } from 'react';
import { RecipeCard } from '../components/RecipeCard';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { RecipeModal } from '../components/RecipeModal';
import { Heart, ChefHat } from 'lucide-react';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strInstructions?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strYoutube?: string;
}

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Beef', 'Chicken', 'Dessert', 'Lamb', 'Miscellaneous', 
    'Pasta', 'Pork', 'Seafood', 'Side', 'Starter', 'Vegan', 'Vegetarian'
  ];

  useEffect(() => {
    fetchRecipes();
    loadFavorites();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const responses = await Promise.all([
        fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken'),
        fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=beef'),
        fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=pasta')
      ]);
      
      const data = await Promise.all(responses.map(res => res.json()));
      const allRecipes = [...(data[0]?.meals || []), ...(data[1]?.meals || []), ...(data[2]?.meals || [])];
      
      // Get unique recipes and limit to 20
      const uniqueRecipes = allRecipes.filter((recipe, index, self) => 
        index === self.findIndex(r => r.idMeal === recipe.idMeal)
      ).slice(0, 20);
      
      setRecipes(uniqueRecipes);
      setFilteredRecipes(uniqueRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('favoriteRecipes');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (recipeId: string) => {
    const updatedFavorites = favorites.includes(recipeId)
      ? favorites.filter(id => id !== recipeId)
      : [...favorites, recipeId];
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterRecipes(term, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterRecipes(searchTerm, category);
  };

  const filterRecipes = (term: string, category: string) => {
    let filtered = recipes;

    if (term) {
      filtered = filtered.filter(recipe =>
        recipe.strMeal.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(recipe => recipe.strCategory === category);
    }

    setFilteredRecipes(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">Recipe Finder</h1>
            </div>
            <div className="flex items-center space-x-2 text-orange-500">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">{favorites.length} favorites</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchAndFilter
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          categories={categories}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
        />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                isFavorite={favorites.includes(recipe.idMeal)}
                onToggleFavorite={toggleFavorite}
                onViewDetails={setSelectedRecipe}
              />
            ))}
          </div>
        )}

        {!loading && filteredRecipes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No recipes found. Try adjusting your search or filters.</p>
          </div>
        )}
      </main>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isFavorite={favorites.includes(selectedRecipe.idMeal)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
};

export default Index;
