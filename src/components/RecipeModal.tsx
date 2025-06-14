
import React from 'react';
import { X, Heart, ExternalLink, Clock, Users } from 'lucide-react';

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

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const getIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 8; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
      if (ingredient && ingredient.trim()) {
        ingredients.push(ingredient);
      }
    }
    return ingredients;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const ingredients = getIngredients();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 pr-4">{recipe.strMeal}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(recipe.idMeal)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <Heart 
                className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full font-medium">
                    {recipe.strCategory}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>30 min</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>4 servings</span>
                  </div>
                </div>
                
                {recipe.strYoutube && (
                  <a
                    href={recipe.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Watch Video</span>
                  </a>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h3>
              <ul className="space-y-2 mb-8">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {recipe.strInstructions && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {recipe.strInstructions}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
