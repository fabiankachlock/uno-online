import {
  GameEvent,
  GameRule,
  GameRulePriority,
  GameState
} from '../../interface.js';
import { UIClientEvent } from '../../../../types/client.js';
import { CardDeck } from '../../cards/deck';

export abstract class BaseGameRule implements GameRule {
  constructor() {}

  readonly priority = GameRulePriority.none;

  isResponsible = (state: GameState, event: UIClientEvent) => false;

  getEvents = (state: GameState, event: UIClientEvent) => [] as GameEvent[];

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => ({
    newState: state,
    moveCount: 0
  });
}
