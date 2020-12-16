import React, { useState } from 'react';
import { Grid, Input, Dropdown, Icon } from 'semantic-ui-react';
import { Cookies } from '../providers/CookieProvider';
import { Constraint } from './ConstraintsGrid';

interface Props {
  constraint: Constraint,
  index: number,
  onDelete: ((index: number) => void),
  onChange: ((index: number, constraint: Constraint) => void)
  onError?: ((name: string) => void),
  onClearError?: ((name: string) => void),
}

const ConstraintCell: React.FC<Props> = ({constraint, index, onChange, onDelete, onError, onClearError}) => {
  const [error, setError] = useState(false);
  const cookieOptions = Object.keys(Cookies).map((value) => {return {key: value, value: value, text: `${value}`}});
  const equalityOptions = [
    {key: "lte", value: "lte", text: "<="},
    {key: "eq", value: "eq", text: "="},
    {key: "gte", value: "gte", text: ">="},
  ];

  return (
    <Grid columns="16" verticalAlign="middle" style={{marginBottom: 0, marginTop: -14, paddingTop: 0}}>
      <Grid.Column width={9}>
        <Dropdown
          placeholder="Cookie"
          fluid
          search
          selection
          options={cookieOptions}
          defaultValue={constraint.name}
          onChange={(event, data) => {
            onChange(index, {
              ...constraint,
              name: data.value?.toString() ?? "",
            });
          }} />
      </Grid.Column>
      <Grid.Column width={3}>
        <Dropdown
          placeholder="Condition"
          fluid
          selection
          options={equalityOptions}
          defaultValue={constraint.equality}
          onChange={(event, data) => {
            onChange(index, {
              ...constraint,
              equality: data.value?.toString() ?? "eq",
            });
          }} />
      </Grid.Column>
      <Grid.Column width={3}>
        <Input 
          fluid
          placeholder='0' 
          type="number"
          defaultValue={constraint.value}
          error={error}
          onChange={(event, data) => {
            if (parseInt(data.value?.toString()) < 0) {
              if (onError !== undefined) {
                onError(constraint.name);
              }
              setError(true);
              onChange(index, {
                ...constraint,
                value: "0",
              });
              return;
            }
            if (onClearError !== undefined) {
              onClearError(constraint.name);
            }
            setError(false);
            onChange(index, {
              ...constraint,
              value: data.value?.toString() ?? "",
            });
          }}/>
      </Grid.Column>
      <Grid.Column textAlign="left">
        <a href="#!" onClick={(event) => {
          event.preventDefault();
          onDelete(index);
        }}>
          <Icon name="close" />
        </a>
      </Grid.Column>
    </Grid>
  );
}

export default ConstraintCell;