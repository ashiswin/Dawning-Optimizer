import React from 'react';
import { Grid, Segment, Image, Input, InputOnChangeData } from 'semantic-ui-react';

export interface Ingredient {
  name: string,
  description: string,
  imageUrl: string,
}

interface Props {
  ingredient: Ingredient,
  onChange?: ((event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void),
}

const IngredientCell: React.FC<Props> = ({ ingredient, onChange }) => {
  return (
    <Segment style={{backgroundColor: "#424242"}}>
      <Grid columns="16" verticalAlign="middle">
        <Grid.Column width={3}>
          <Image src={ingredient.imageUrl} size="tiny" />
        </Grid.Column>
        <Grid.Column width={9}>
          <h3>{ingredient.name}</h3>
          {ingredient.description}
        </Grid.Column>
        <Grid.Column width={4}>
          <Input placeholder='Amount' type="number" onChange={onChange} fluid />
        </Grid.Column>
      </Grid>
    </Segment>
  );
}

export default IngredientCell;