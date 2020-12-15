import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Header, Segment, Tab, Table, Image } from 'semantic-ui-react';
import { CookieResult, Quantity } from '../App';
import { Cookies } from '../providers/CookieProvider';

interface Props {
  cookieResult?: CookieResult,
  onBakeItClick: () => void,
}

const ResultPane: React.FC<Props> = ({cookieResult, onBakeItClick}) => {
  const [result, setResult] = useState(cookieResult);
  const [loading, setLoading] = useState(false);

  const onBakeItClickHandler = () => {
    setLoading(true);
    onBakeItClick();
  }

  useEffect(() => { 
    setResult(cookieResult); 
    setLoading(false); 
  }, [cookieResult]);

  const getResultTable = (quantities: Quantity[]) => {
    const rows = quantities.map((quantity) => {
      const name = Object.keys(quantity)[0];
      return (
        <Table.Row>
          <Table.Cell><Image src={Cookies[name.trim()].imageUrl} size="tiny" /></Table.Cell>
          <Table.Cell>
            <Header>{name.trim()}</Header>
            <p>{Cookies[name.trim()].description}</p>
          </Table.Cell>
          <Table.Cell>{quantity[name]}</Table.Cell>
        </Table.Row>
      );
    });

    return (
      <Table celled unstackable style={{borderRadius: 0, backgroundColor: "#545454", color: "white"}}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell style={styles.tableHeader} colSpan={2}>Cookie</Table.HeaderCell>
            <Table.HeaderCell style={styles.tableHeader}>Quantity</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows}
        </Table.Body>
      </Table>
    );
  }
  
  const panes = [
    {
      menuItem: `No Masterwork (${result?.nomasterwork.total} ${result?.nomasterwork.total === 1 ? "cookie" : "cookies"})`,
      render: () => result !== undefined 
        ? <Tab.Pane attached={false} style={styles.tabPane}>
            <p>
              A non-masterworked oven consumes <b>15 Essence of Dawning</b> for each cookie baked.
            </p>
            {
              result.nomasterwork.total === 0
                ? <p>You don't have enough ingredients to bake any cookies.</p>
                : getResultTable(result.nomasterwork.items)
            }
          </Tab.Pane> 
        : null,
    },
    {
      menuItem: `Masterworked (${result?.masterwork.total}  ${result?.masterwork.total === 1 ? "cookie" : "cookies"})`,
      render: () => result !== undefined 
        ? <Tab.Pane attached={false} style={styles.tabPane}>
            <p>
              A masterworked oven consumes <b>10 Essence of Dawning</b> for each cookie baked.
            </p>
            {
              result.masterwork.total === 0
              ? <p>You don't have enough ingredients to bake any cookies.</p>
              : getResultTable(result.masterwork.items)
            }
          </Tab.Pane> 
        : null,
    },
  ]

  return (
    <Container fluid style={{marginBottom: 16}}>
      <Grid columns="two" verticalAlign="middle">
        <Grid.Column>
          <Header>Result</Header>
        </Grid.Column>
        <Grid.Column floated="right">
          <Button content='Bake It!' primary floated="right" loading={loading} disabled={loading} onClick={onBakeItClickHandler} />
        </Grid.Column>
      </Grid>
      {
        result !== undefined
          ? <Segment style={{backgroundColor: "#373737", borderRadius: 0, border: "#FFFFFFF solid 0.5px"}}>
              <Tab menu={{ secondary: true, pointing: true }} panes={panes} style={{color: "white !important"}}/>
            </Segment>
          : null
      }
    </Container>
  );
}

const styles = {
  tabPane: {
    backgroundColor: "#373737", 
    boxShadow: "none", 
    border: "none",
    marginTop: -8,
  },
  tableHeader: {
    backgroundColor: "#545454", 
    color: "white",
  }
}

export default ResultPane;