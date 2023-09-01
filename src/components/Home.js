import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

function Home() {
  const apiKey = '0c7973cc644b45cd8f17640757191e85';

  const storedFavorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];

  const [ingredients, setIngredients] = useState('');
  const [diet, setDiet] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState(storedFavorites);

  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
  }, [favoriteRecipes]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const searchTerm = encodeURIComponent(ingredients);
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&apiKey=${apiKey}&number=10`
      );
      const data = await response.json();
      setRecipes(data.results);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const openRecipeModal = async (recipe) => {
    setSelectedRecipe(recipe);

    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`
      );
      const data = await response.json();
      setSelectedRecipe((prevRecipe) => ({
        ...prevRecipe,
        instructions: data.instructions,
        image: data.image,
        extendedIngredients: data.extendedIngredients,
      }));
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  const addToFavorites = (recipe) => {
    const newFavorites = [...favoriteRecipes, recipe];
    setFavoriteRecipes(newFavorites);
    alert('Saved to Favorites');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center" style={{ paddingTop: '100px',color:'orange',fontWeight:'bolder' }}>
        Welcome to RecipeRadar
      </h1>
      <h2 className="text-center mb-4" style={{color:'lightblue',fontWeight:'bold'}}>Discover New Recipes</h2>
      <form onSubmit={handleSearch} className="text-center mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter ingredients (comma-separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Dietary preferences"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search Recipes
        </button>
      </form>
      <div className="row">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="col-md-4 mb-4">
            <div className="card">
              <img src={recipe.image} className="card-img-top" alt={recipe.title} />
              <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>
                <Button variant="primary" onClick={() => openRecipeModal(recipe)}>
                  View Recipe
                </Button>
                {favoriteRecipes.some((favRecipe) => favRecipe.id === recipe.id) ? (
                  <Button variant="success" className="ml-2" disabled>
                    Saved
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="ml-2"
                    onClick={() => {
                      addToFavorites(recipe);
                    }}
                  >
                    Add to Favorites
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for displaying recipe details */}
      <Modal show={selectedRecipe !== null} onHide={closeRecipeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecipe?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={selectedRecipe?.image} alt={selectedRecipe?.title} className="img-fluid mb-3" />
          <h5>Ingredients:</h5>
          <ul>
            {selectedRecipe?.extendedIngredients?.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.original}</li>
            ))}
          </ul>
          <h5>Instructions:</h5>
          <div>
            {selectedRecipe?.instructions?.split('\n').map((step, index) => {
              // Remove HTML tags from step
              const cleanStep = step.replace(/<[^>]*>?/gm, '');

              return <p key={index}>{cleanStep}</p>;
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeRecipeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row mt-5">
        <div className="col-md-12">
          {/* <Favorites favoriteRecipes={favoriteRecipes} /> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
