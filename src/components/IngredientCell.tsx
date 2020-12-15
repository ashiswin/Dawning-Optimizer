import React, { useState } from 'react';
import { Grid, Segment, Image, Input } from 'semantic-ui-react';

export interface Ingredient {
  name: string,
  description: string,
  source: string,
  imageUrl: string,
}

interface Props {
  ingredient: Ingredient,
  onChange: ((name: string, quantity: string) => void),
  onError?: ((name: string) => void),
  onClearError?: ((name: string) => void),
}

const IngredientCell: React.FC<Props> = ({ ingredient, onChange, onError, onClearError }) => {
  const [error, setError] = useState(false);

  return (
    <Segment style={{backgroundColor: "#373737", borderRadius: 0, border: "#FFFFFFF solid 0.5px"}} >
      <Grid columns="16" verticalAlign="middle">
        <Grid.Column width={3}>
          <Image src={ingredient.imageUrl} size="tiny" />
        </Grid.Column>
        <Grid.Column width={9}>
          <h3>{ingredient.name}</h3>
          <p style={{marginTop: -8}}>{ingredient.description}</p>
          <p><strong>Source: </strong>{ingredient.source}</p>
        </Grid.Column>
        <Grid.Column width={4}>
          <Input 
            fluid
            placeholder='0' 
            type="number" error={error} 
            defaultValue={localStorage.getItem(ingredient.name)} 
            onChange={(event, data) => {
              if (parseInt(data.value) < 0) {
                setError(true);
                if (onError !== undefined) {
                  onError(ingredient.name);
                }
                onChange(ingredient.name, "0")
              } else {
                setError(false);
                if (onClearError !== undefined) {
                  onClearError(ingredient.name);
                }
                localStorage.setItem(ingredient.name, data.value)
                onChange(ingredient.name, data.value);
              }
            }} />
        </Grid.Column>
      </Grid>
    </Segment>
  );
}

export default IngredientCell;