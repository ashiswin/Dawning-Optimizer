import React, { useEffect, useState } from 'react';
import './App.css';
import { Container, Grid, Message } from 'semantic-ui-react';
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
  const [errorIngredients, setErrorIngredients] = useState<Set<string>>();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);

  const onQuantityChangeHandler = (name: string, quantity: string) => {
    let newQuantity: { [index: string]: string } = {};
    newQuantity[name] = quantity;
    setQuantities({ ...quantities, ...newQuantity });
  }

  const onIngredientErrorHandler = (name: string) => {
    let newIngredients = new Set(errorIngredients);
    newIngredients.add(name);
    setErrorIngredients(newIngredients);
  }

  const onClearErrorHandler = (name: string) => {
    let newIngredients = new Set(errorIngredients);
    newIngredients.delete(name);
    setErrorIngredients(newIngredients);
  }

  useEffect(() => {
    if (errorIngredients === undefined) {
      return;
    }

    if (errorIngredients.size === 0) {
      setErrorVisible(false);
      return;
    }

    setErrorMessage(`The following ingredient${errorIngredients.size === 1 ? " has" : "s have"} negative values and will be treated as 0 during calculation:`)
    setErrorVisible(true);
  }, [errorIngredients])

  const onBakeItClickHandler = () => {
    axios.post('https://dawning-optimizer.herokuapp.com/calculate', quantities)
      .then(function (response) {
        const items = response.data.items.map((item: [string, number]) => {
          let quantity: Quantity = {};
          quantity[item[0]] = item[1].toString();
          return quantity;
        });
        const mwitems = response.data.mwitems.map((item: [string, number]) => {
          let quantity: Quantity = {};
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
      {
        errorVisible
          ? <Container fluid style={{ margin: "0 !important", paddingTop: 16, paddingLeft: 24, paddingRight: 24, paddingBottom: 16 }} className="surface">
            <Message negative style={{ backgroundColor: "#424242" }}>
              <Message.Header>{errorMessage}</Message.Header>
              <ul>
                {
                  errorIngredients !== undefined
                    ? Array.from(errorIngredients).map((value) => <li>{value}</li>)
                    : null
                }
              </ul>
            </Message>
          </Container>
          : null
      }
      <Grid columns="3" stackable divided style={{ margin: 0, padding: 8 }} className="surface">
        <Grid.Column>
          <IngredientGrid
            title="Combatant Ingredients"
            ingredients={Ingredients.combatant}
            onChange={onQuantityChangeHandler}
            onError={onIngredientErrorHandler}
            onClearError={onClearErrorHandler} />
        </Grid.Column>
        <Grid.Column>
          <IngredientGrid
            title="Kill-style Ingredients"
            ingredients={Ingredients.killstyle}
            onChange={onQuantityChangeHandler}
            onError={onIngredientErrorHandler}
            onClearError={onClearErrorHandler} />
        </Grid.Column>
        <Grid.Column>
          <IngredientGrid
            title="Dawning Essence"
            ingredients={Ingredients.essence}
            onChange={onQuantityChangeHandler}
            onError={onIngredientErrorHandler}
            onClearError={onClearErrorHandler} />
          <ResultPane cookieResult={cookieResult} onBakeItClick={onBakeItClickHandler} />
        </Grid.Column>
      </Grid>
    </>
  );
}

export default App;
