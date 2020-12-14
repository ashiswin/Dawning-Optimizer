import React, { useState } from 'react';
import './App.css';
import { Container, Grid } from 'semantic-ui-react';
import IngredientGrid from './components/IngredientGrid';
import { Ingredients } from './providers/IngredientProvider';
import ResultPane from './components/ResultPane';
import axios from 'axios';

export interface Quantity {
  [index: string]: string,
}

export interface CookieResult {
  [index: string]: {
    total: number,
    items: Quantity[],
  }
}

function App() {
  const [quantities, setQuantities] = useState<Quantity>({});
  const [cookieResult, setCookieResult] = useState<CookieResult>();

  const onQuantityChangeHandler = (name: string, quantity: string) => {
    let newQuantity: {[index: string]: string} = {};
    newQuantity[name] = quantity;
    setQuantities({...quantities, ...newQuantity});
  }

  const onBakeItClickHandler = () => {
    axios.post('https://dawning-optimizer.herokuapp.com/calculate', quantities)
    .then(function (response) {
      const items = response.data.items.map((item: [string, number]) => {
        let quantity:Quantity = {}; 
        quantity[item[0]] = item[1].toString(); 
        return quantity;
      });
      const mwitems = response.data.mwitems.map((item: [string, number]) => {
        let quantity:Quantity = {}; 
        quantity[item[0]] = item[1].toString(); 
        return quantity;
      });
      console.log(items);
      setCookieResult({
        "nomasterwork": {
          total: response.data.total,
          items: items,
        },
        "masterwork": {
          total: response.data.mwtotal,
          items: mwitems,
        }
      })
    })
  }

  return (
    <>
      <Container fluid style={{ margin: "0 !important", paddingTop: 16, paddingLeft: 24, paddingRight: 24, paddingBottom: 16 }} className="surface">
        <h1>Dawning Optimizer</h1>
        <p style={{ fontSize: "17px" }}>
          Since Bungie did not include the ability to retrieve the amount of each Dawning ingredient you have via their API, you need to manually enter in the quantity of each material you have. The maximum number of goods you can bake with the Dawning oven will then be shown to you.
        </p>
      </Container>
      <Grid columns="3" stackable divided style={{ margin: 0, padding: 8 }} className="surface">
        <Grid.Column>
          <IngredientGrid title="Combatant Ingredients" ingredients={Ingredients.combatant} onChange={onQuantityChangeHandler} topLevel />
          <IngredientGrid title="Dawning Essence" ingredients={Ingredients.essence} onChange={onQuantityChangeHandler} />
        </Grid.Column>
        <Grid.Column>
          <IngredientGrid title="Kill-style Ingredients" ingredients={Ingredients.killstyle} onChange={onQuantityChangeHandler} topLevel />
        </Grid.Column>
        <Grid.Column>
          <ResultPane cookieResult={cookieResult} onBakeItClick={onBakeItClickHandler} />
        </Grid.Column>
      </Grid>
    </>
  );
}

export default App;
