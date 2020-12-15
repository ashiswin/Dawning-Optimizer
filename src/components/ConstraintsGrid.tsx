import React, { useState } from 'react';
import { Grid, Container, Header, Segment, Button } from 'semantic-ui-react';
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
  const [constraints, setConstraints] = useState<Constraint[]>(JSON.parse(localStorage.getItem("constraints") ?? "[]"));

  const onDeleteHandler = (index: number) => {
    let newConstraints = [...constraints];
    newConstraints.splice(index, 1);
    setConstraints(newConstraints);
    if (onClearError !== undefined) {
      onClearError(constraints[index].name);
    }
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
      onError={onError}
      onClearError={onClearError}
      key={`${constraint.name} ${constraint.equality}`}
    />);

  return (
    <Container fluid style={{ marginBottom: 16 }}>
      <Grid columns="sixteen" verticalAlign="middle">
        <Grid.Column>
          <Header>Constraints</Header>
        </Grid.Column>
        <Grid.Column floated="right" width={12}>
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