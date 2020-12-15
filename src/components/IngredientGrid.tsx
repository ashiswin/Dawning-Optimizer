import React from 'react';
import { Grid, Container, Header } from 'semantic-ui-react';
import IngredientCell, { Ingredient } from './IngredientCell';

interface Props {
  title: string,
  ingredients: Ingredient[],
  onChange: ((name: string, quantity: string) => void),
  onError?: ((name: string) => void),
  onClearError?: ((name: string) => void),
}

const IngredientGrid: React.FC<Props> = ({title, ingredients, onChange, onError, onClearError}) => {
  let rows = ingredients.map((ingredient: Ingredient) => {
    return(
      <Grid.Row
        key={ingredient.name}>
        <IngredientCell
          ingredient={ingredient}
          onChange={onChange}
          onError={onError}
          onClearError={onClearError}
        />
      </Grid.Row>
    )
  });

  return (
    <Container fluid style={{marginBottom: 16}}>
      <Header>{title}</Header>
      <Grid.Column>
        {rows}
      </Grid.Column>
    </Container>
  );
}

export default IngredientGrid;