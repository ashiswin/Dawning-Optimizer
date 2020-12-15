import React, { useEffect, useState } from 'react';
import './App.css';
import { Container, Divider, Grid, Icon, Message } from 'semantic-ui-react';
import IngredientGrid from './components/IngredientGrid';
import { Ingredients } from './providers/IngredientProvider';
import ResultPane from './components/ResultPane';
import axios from 'axios';
import ConstraintsGrid, { Constraint } from './components/ConstraintsGrid';

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
  const [quantities, setQuantities] = useState<Quantity>(JSON.parse(localStorage.getItem("quantityState") ?? "{}"));
  const [cookieResult, setCookieResult] = useState<CookieResult>();
  const [errorIngredients, setErrorIngredients] = useState<Set<string>>();
  const [errorIngredientsMessage, setErrorIngredientsMessage] = useState("");
  const [errorIngredientsVisible, setErrorIngredientsVisible] = useState(false);
  const [constraints, setConstraints] = useState<Constraint[]>(JSON.parse(localStorage.getItem("constraints") ?? "[]"));
  const [errorConstraints, setErrorConstraints] = useState<Set<string>>();
  const [errorConstraintsMessage, setErrorConstraintsMessage] = useState("");
  const [errorConstraintsVisible, setErrorConstraintsVisible] = useState(false);

  const onQuantityChangeHandler = (name: string, quantity: string) => {
    let newQuantity: { [index: string]: string } = {};
    newQuantity[name] = quantity;
    setQuantities({ ...quantities, ...newQuantity });
    localStorage.setItem("quantityState", JSON.stringify({ ...quantities, ...newQuantity }));
  }

  const onIngredientErrorHandler = (name: string) => {
    let newIngredients = new Set(errorIngredients);
    newIngredients.add(name);
    setErrorIngredients(newIngredients);
  }

  const onClearIngredientErrorHandler = (name: string) => {
    let newIngredients = new Set(errorIngredients);
    newIngredients.delete(name);
    setErrorIngredients(newIngredients);
  }

  const onConstraintChangeHandler = (constraints: Constraint[]) => {
    setConstraints(constraints);
    localStorage.setItem("constraints", JSON.stringify(constraints));
  }

  const onConstraintErrorHandler = (name: string) => {
    let newConstraints = new Set(errorConstraints);
    newConstraints.add(name);
    setErrorConstraints(newConstraints);
  }

  const onClearConstraintErrorHandler = (name: string) => {
    let newConstraints = new Set(errorConstraints);
    newConstraints.delete(name);
    setErrorConstraints(newConstraints);
  }

  useEffect(() => {
    if (errorIngredients === undefined) {
      return;
    }

    if (errorIngredients.size === 0) {
      setErrorIngredientsVisible(false);
      return;
    }

    setErrorIngredientsMessage(`The following ingredient${errorIngredients.size === 1 ? " has" : "s have"} negative values and will be treated as 0 during calculation:`)
    setErrorIngredientsVisible(true);
  }, [errorIngredients])

  useEffect(() => {
    if (errorConstraints === undefined) {
      return;
    }

    if (errorConstraints.size === 0) {
      setErrorConstraintsVisible(false);
      return;
    }

    setErrorConstraintsMessage(`The following constraint${errorConstraints.size === 1 ? " has" : "s have"} negative values and will be treated as 0 during calculation:`)
    setErrorConstraintsVisible(true);
  }, [errorConstraints])

  const onBakeItClickHandler = () => {
    axios.post('https://dawning-optimizer.herokuapp.com/calculate', {quantities: quantities, constraints: constraints})
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
      <div style={{ margin: "0 !important", paddingTop: 16, paddingLeft: 24, paddingRight: 24, paddingBottom: 16 }} className="surface">
        <h1>Dawning Optimizer</h1>
        <p style={{ fontSize: "16px" }}>
          Happy Dawning Guardians! In your efforts to complete the plethora of bounties and triumphs for the Dawning this year, you may be wondering how to get the most out of your hard-earned ingredients. Well you've come to the right place!
        </p>
        <p style={{ fontSize: "16px" }}>
          Simply key in the number of each ingredient you have in the textboxes below and <strong>Bake</strong> 'em all together to find out the best possible combination to make to get the most cookies possible.
        </p>
        <p style={{color: "grey"}}>
          (Cookies that have been sunset are excluded by default, but you can remove their constraints to include them if you so wish)
        </p>
        <h3>Constraints</h3>
        <p style={{ fontSize: "16px" }}>
          This year, we have added the ability to add constraints to the cookie calculation. If you wish to set a minimum/maximum number of a specific cookie, simply add a constraint for that cookie!
        </p>
        <p style={{ fontSize: "16px" }}>
          E.g. If a bounty requires 10 Vanilla Blades, you can <strong>Add a Constraint</strong> for Vanilla Blades &gt;= 10, which will ensure that you'll get at least 10 Vanilla Blades.
        </p>
      </div>
      {
        errorIngredientsVisible
          ? <Container fluid style={{ margin: "0 !important", paddingTop: 16, paddingLeft: 24, paddingRight: 24, paddingBottom: 16 }} className="surface">
            <Message negative style={{ backgroundColor: "#424242" }}>
              <Message.Header>{errorIngredientsMessage}</Message.Header>
              <ul>
                {
                  errorIngredients !== undefined
                    ? Array.from(errorIngredients).map((value) => <li key={value}>{value}</li>)
                    : null
                }
              </ul>
            </Message>
          </Container>
          : null
      }
      {
        errorConstraintsVisible
          ? <Container fluid style={{ margin: "0 !important", paddingTop: 16, paddingLeft: 24, paddingRight: 24, paddingBottom: 16 }} className="surface">
            <Message negative style={{ backgroundColor: "#424242" }}>
              <Message.Header>{errorConstraintsMessage}</Message.Header>
              <ul>
                {
                  errorConstraints !== undefined
                    ? Array.from(errorConstraints).map((value) => <li key={value}>{value}</li>)
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
            onClearError={onClearIngredientErrorHandler} />
        </Grid.Column>
        <Grid.Column>
          <IngredientGrid
            title="Kill-style Ingredients"
            ingredients={Ingredients.killstyle}
            onChange={onQuantityChangeHandler}
            onError={onIngredientErrorHandler}
            onClearError={onClearIngredientErrorHandler} />
        </Grid.Column>
        <Grid.Column>
          <IngredientGrid
            title="Dawning Essence"
            ingredients={Ingredients.essence}
            onChange={onQuantityChangeHandler}
            onError={onIngredientErrorHandler}
            onClearError={onClearIngredientErrorHandler} />
          <ConstraintsGrid 
            onChange={onConstraintChangeHandler} 
            onError={onConstraintErrorHandler} 
            onClearError={onClearConstraintErrorHandler} />
          <ResultPane cookieResult={cookieResult} onBakeItClick={onBakeItClickHandler} />
        </Grid.Column>
      </Grid>
      <Divider />
      <Container textAlign="center" style={{color: "white", paddingBottom: 16}}>
        Developed by <a href="https://github.com/ashiswin">ashiswin <Icon name="github" /></a>
      </Container>
    </>
  );
}

export default App;
