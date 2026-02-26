import { Link } from 'react-router-dom';

function MealCard({ meal }) {
  const shortDescription = meal.strInstructions
    ? `${meal.strInstructions.slice(0, 120)}...`
    : 'View details for ingredients and full instructions.';

  return (
    <Link to={`/meal/${meal.idMeal}`} className="meal-card">
      <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-image" />
      <div className="meal-content">
        <h3>{meal.strMeal}</h3>
        <p className="meal-area">{meal.strArea || 'Unknown Area'}</p>
        <p>{shortDescription}</p>
      </div>
    </Link>
  );
}

export default MealCard;