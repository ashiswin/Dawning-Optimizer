import React from 'react';
import './App.css';
import { Container, Grid, Header } from 'semantic-ui-react';
import IngredientGrid from './components/IngredientGrid';
import { Ingredients } from './providers/IngredientProvider';

function App() {
  return (
    <>
      <Container fluid style={{margin: 0, paddingTop: 16, paddingLeft: 24, paddingRight: 24, paddingBottom: 16}} className="surface">
        <h1>Dawning Optimizer</h1>
        <p style={{fontSize: "17px"}}>
          Since Bungie did not include the ability to retrieve the amount of each Dawning ingredient you have via their API, you need to manually enter in the quantity of each material you have. The maximum number of goods you can bake with the Dawning oven will then be shown to you.
        </p>
      </Container>
      <Grid columns="3" stackable divided style={{margin: 0, padding: 8}} className="surface">
        <Grid.Column>
          <IngredientGrid title="Combatant Ingredients" ingredients={Ingredients.combatant}/>
          <IngredientGrid title="Dawning Essence" ingredients={Ingredients.essence}/>
        </Grid.Column>
        <Grid.Column>
          <IngredientGrid title="Kill-style Ingredients" ingredients={Ingredients.killstyle}/>
        </Grid.Column>
        <Grid.Column>
          <Container fluid>
            <Header>Output</Header>
          </Container>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default App;
