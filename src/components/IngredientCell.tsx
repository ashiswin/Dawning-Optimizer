import React from 'react';
import { Grid, Segment, Image, Input } from 'semantic-ui-react';

export interface Ingredient {
  name: string,
  description: string,
  imageUrl: string,
}

interface Props {
  ingredient: Ingredient,
  onChange: ((name: string, quantity: string) => void),
}

const IngredientCell: React.FC<Props> = ({ ingredient, onChange }) => {
  return (
    <Segment style={{backgroundColor: "#373737", borderRadius: 0, border: "#FFFFFFF solid 0.5px"}} >
      <Grid columns="16" verticalAlign="middle">
        <Grid.Column width={3}>
          <Image src={ingredient.imageUrl} size="tiny" />
        </Grid.Column>
        <Grid.Column width={9}>
          <h3>{ingredient.name}</h3>
          <p style={{marginTop: -8}}>{ingredient.description}</p>
        </Grid.Column>
        <Grid.Column width={4}>
          <Input placeholder='0' type="number" onChange={(event, data) => {onChange(ingredient.name, data.value)}} fluid />
        </Grid.Column>
      </Grid>
    </Segment>
  );
}

export default IngredientCell;