import React, { useState } from 'react';
import { Grid, Container, Header, Segment, Button } from 'semantic-ui-react';
import { Cookies } from '../providers/CookieProvider';
import ConstraintCell from './ConstraintCell';


export interface Constraint {
  name: string,
  equality: string,
  value: string,
}

interface Props {
  onChange: ((constraints: Constraint[]) => void),
  onError?: ((name: string) => void),
  onClearError?: ((name: string) => void),
}

const ConstraintsGrid: React.FC<Props> = ({ onChange, onError, onClearError }) => {
  const getSunsetConstraints = () => {
    let newConstraints = [];
    for (const [ name, cookie ] of Object.entries(Cookies)) {
      if (!cookie.sunset) {
        continue;
      }
      const constraint = {
        name: name,
        equality: "eq",
        value: "0",
      };
      newConstraints.push(constraint);
    }
    return newConstraints;
  }

  const storedConstraints = localStorage.getItem("constraints");
  const [constraints, setConstraints] = useState<Constraint[]>(
    storedConstraints !== null
      ? JSON.parse(localStorage.getItem("constraints") ?? "[]")
      : getSunsetConstraints()
  );

  const onDeleteHandler = (index: number) => {
    let newConstraints = [...constraints];
    newConstraints.splice(index, 1);
    setConstraints(newConstraints);
    onChange(newConstraints);
  };
  const onAddHandler = () => {
    let newConstraints = constraints.concat([{ name: "Vanilla Blades", equality: "eq", value: "0" }]);
    setConstraints(newConstraints);
    onChange(newConstraints);
  }
  const onChangeHandler = (index: number, constraint: Constraint) => {
    let newConstraints = [...constraints];
    newConstraints.splice(index, 1, constraint);
    setConstraints(newConstraints);
    onChange(newConstraints);
  }
  const onSunsetRemoveClickHandler = () => {
    let newConstraints = [...constraints];
    
    const sunsetConstraints = getSunsetConstraints();
    sunsetConstraints.forEach((constraint) => {
      for (let i = 0; i < constraints.length; i++) {
        if (constraints[i].name === constraint.name && constraints[i].equality === constraint.equality && constraints[i].value === constraint.value) {
          return;
        }
      }
      newConstraints.push(constraint);
    })

    setConstraints(newConstraints);
  }
  const onClearHandler = () => {
    setConstraints([]);
    onChange([]);
  }

  const rows = constraints.map((constraint, index) =>
    <ConstraintCell
      constraint={constraint}
      index={index}
      onDelete={onDeleteHandler}
      onChange={onChangeHandler}
      key={`${constraint.name} ${constraint.equality}`}
    />);

  return (
    <Container fluid style={{ marginBottom: 16 }}>
      <Grid columns="sixteen" verticalAlign="middle">
        <Grid.Column>
          <Header>Constraints</Header>
        </Grid.Column>
        <Grid.Column floated="right" width={12}>
          <Button content='Ignore Sunset Cookies' primary floated="right" icon="ban" onClick={onSunsetRemoveClickHandler} />
          <Button content='Clear All' floated="right" icon="delete" onClick={onClearHandler} />
        </Grid.Column>
      </Grid>
      <Segment style={{ backgroundColor: "#373737", borderRadius: 0, border: "#FFFFFFF solid 0.5px" }}>
        <Grid.Column>
          {rows}
        </Grid.Column>
        <Button
          content="Add Constraint"
          icon="plus"
          primary
          onClick={onAddHandler} />
      </Segment>
    </Container>
  );
}

export default ConstraintsGrid;