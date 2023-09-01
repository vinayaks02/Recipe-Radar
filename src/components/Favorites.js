import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Container, Row, Col } from 'react-bootstrap';
import { FaShareAlt, FaFacebook, FaTwitter } from 'react-icons/fa';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

function Favorites() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharedUrl, setSharedUrl] = useState('');

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    setFavoriteRecipes(storedFavorites);
  }, []);

  const removeFavorite = (recipeId) => {
    const updatedFavorites = favoriteRecipes.filter((recipe) => recipe.id !== recipeId);
    setFavoriteRecipes(updatedFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
  };

  const openRecipeModal = async (recipe) => {
    try {
      const apiKey = '0c7973cc644b45cd8f17640757191e85';
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`
      );
      const data = await response.json();
      console.log('Fetched recipe details:', data);

      setSelectedRecipe({
        ...recipe,
        instructions: data.instructions,
        extendedIngredients: data.extendedIngredients,
        image: data.image, // Add the image property
      });
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  const openShareModal = (recipe) => {
    setSharedUrl(`https://yourwebsite.com/recipes/${recipe.id}`); // Replace with your actual website URL
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
  };

  const handleShareButtonClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <Container className="mt-5">
      <div className="text-center mb-5">
        <h2 className="mt-4 mb-4" style={{ paddingTop: "30px",color:'orange', fontWeight:'bolder', fontSize:'50px'}}>Favorite Recipes</h2>
        <div className="divider mx-auto"></div>
      </div>
      <Row className="mt-4">
        {favoriteRecipes.map((recipe) => (
          <Col key={recipe.id} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={recipe.image} alt={recipe.title} />
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <Button variant="primary" onClick={() => openRecipeModal(recipe)}>View</Button>
                <Button variant="secondary" className="ml-2" onClick={() => openShareModal(recipe)}>
                  <FaShareAlt />
                </Button>
                <Button variant="danger" className="ml-2" onClick={() => removeFavorite(recipe.id)}>Remove</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={selectedRecipe !== null} onHide={closeRecipeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecipe?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {selectedRecipe?.image && (
              <div className="text-center">
                <img src={selectedRecipe.image} alt={selectedRecipe.title} style={{ maxWidth: '100%' }} />
              </div>
            )}
            {selectedRecipe?.instructions && (
              <div>
                <h5>Instructions:</h5>
                <p>{selectedRecipe.instructions.replace(/<\/?[^>]+(>|$)/g, '')}</p>
              </div>
            )}
            {selectedRecipe?.extendedIngredients && (
              <div>
                <h5>Ingredients:</h5>
                <ul>
                  {selectedRecipe.extendedIngredients.map((ingredient) => (
                    <li key={ingredient.id}>{ingredient.original}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeRecipeModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showShareModal} onHide={closeShareModal}>
        <Modal.Header closeButton>
          <Modal.Title>Share Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <FacebookShareButton url={sharedUrl} onClick={() => handleShareButtonClick(sharedUrl)}>
              <FaFacebook size={32} />
            </FacebookShareButton>
            <TwitterShareButton url={sharedUrl} onClick={() => handleShareButtonClick(sharedUrl)}>
              <FaTwitter size={32} />
            </TwitterShareButton>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeShareModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Favorites;
