import { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useState } from 'react'
import { getCtrl } from "../lichess/ctrl";
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { sleep } from '../lichess/util';

type CreateGameProps = {
  setGameId: Dispatch<SetStateAction<string>>,
}

export const CreateGame = ({ setGameId }: CreateGameProps) => {
  const ctrl = getCtrl();

  const [gameConfig, setGameConfig] = useState({
    level: 1,
    clock_limit: 300,
    clock_increment: 0,
    color: 'random',
  })

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setGameConfig({
      ...gameConfig,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await ctrl.playAi(gameConfig.level,
                      gameConfig.clock_limit,
                      gameConfig.clock_increment,
                      gameConfig.color
                      );
    setGameId(ctrl.games.games[0].gameId);
    await ctrl.openGame(ctrl.games.games[0].gameId);
  }

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit}>
            <h4>Create a Game</h4>

            <Form.Group as={Row} className="mb-3">
              <Col>
                <Form.Label htmlFor="level">Level</Form.Label>
                <Form.Control
                  type="number"
                  id="level"
                  name="level"
                  value={gameConfig.level}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Col>
                <Form.Label htmlFor="clock_limit">Clock Limit (in seconds)</Form.Label>
                <Form.Control
                  type="number"
                  id="clock_limit"
                  name="clock_limit"
                  value={gameConfig.clock_limit}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Col>
                <Form.Label htmlFor="clock_increment">Clock Increment (in seconds)</Form.Label>
                <Form.Control
                  type="number"
                  id="clock_increment"
                  name="clock_increment"
                  value={gameConfig.clock_increment}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Col>
                <Form.Label htmlFor="color">Color</Form.Label>
                <Form.Control
                  as="select"
                  id="color"
                  name="color"
                  value={gameConfig.color}
                  onChange={handleChange}
                >
                  <option value="random">Random</option>
                  <option value="white">White</option>
                  <option value="black">Black</option>
                </Form.Control>
              </Col>
            </Form.Group>

            <Button type="submit" variant="primary">
              Create Game
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
