import React from 'react';
import { Grid, Container, Header } from 'semantic-ui-react';
import IngredientCell, { Ingredient } from './IngredientCell';

interface Props {
  title: string,
  ingredients: Ingredient[],
  topLevel?: boolean,
}

const IngredientGrid: React.FC<Props> = ({title, ingredients, topLevel}) => {
  let rows = ingredients.map((ingredient: Ingredient) => {
    return(
      <Grid.Row>
        <IngredientCell
          ingredient={ingredient}
        />
      </Grid.Row>
    )
  });

  return (
    <Container fluid style={{marginBottom: 16}}>
      <Header style={{marginBottom: topLevel ? 30 : 16}}>{title}</Header>
      <Grid.Column>
        {rows}
      </Grid.Column>
    </Container>
  );
}

export default IngredientGrid;