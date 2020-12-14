import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Header, Segment } from 'semantic-ui-react';

interface Props {
  text: string,
}

const ResultPane: React.FC<Props> = ({text}) => {
  const [output, setOutput] = useState(text);
  useEffect(() => { setOutput(text) }, [text]);
  
  return (
    <Container fluid style={{marginBottom: 16}}>
      <Grid columns="two">
        <Grid.Column>
          <Header>Result</Header>
        </Grid.Column>
        <Grid.Column floated="right">
          <Button content='Bake It!' primary floated="right" />
        </Grid.Column>
      </Grid>
      <Segment style={{backgroundColor: "#373737", borderRadius: 0, border: "#FFFFFFF solid 0.5px"}}>
        {output}
      </Segment>
    </Container>
  );
}

export default ResultPane;