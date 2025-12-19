const CategoryCard = ({ category }) => {
  return (
    <div className="category-card">
      <img src={category.image} alt={name} />
      <h3>{category.name}</h3>
      <p>{category.description}</p>
    </div>
  )
}

export default CategoryCard