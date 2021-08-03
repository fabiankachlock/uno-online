import { Card, CARD_TYPE } from '../../cards/type.js';
import { BaseGameRule } from './baseRule.js';
import type { UIClientEvent } from '../../../../types/client';
import { UIEventTypes } from '../events/client.js';
import { GameRulePriority, GameState } from '../../interface.js';
import { placeCardEvent } from '../events/gameEvents.js';
import { CardDeck } from '../../cards/deck.js';

export class BasicGameRule extends BaseGameRule {
  name = 'basic-game';

  private static isWild = (t: CARD_TYPE) =>
    t === CARD_TYPE.wild ||
    t === CARD_TYPE.wildDraw2 ||
    t === CARD_TYPE.wildDraw4;
  private static isDraw = (t: CARD_TYPE) =>
    t === CARD_TYPE.draw2 ||
    t === CARD_TYPE.wildDraw2 ||
    t === CARD_TYPE.wildDraw4;

  isResponsible = (state: GameState, event: UIClientEvent) =>
    event.event === UIEventTypes.tryPlaceCard;

  readonly priority = GameRulePriority.low;

  public static readonly canThrowCard = (
    card: Card,
    top: Card,
    activatedTop: boolean
  ): boolean => {
    const fits = card.type === top.type || card.color === top.color;

    if (BasicGameRule.isDraw(top.type) && !activatedTop) {
      return false;
    }

    return fits || BasicGameRule.isWild(card.type);
  };

  public static readonly placeCard = (
    card: Card,
    playerId: string,
    state: GameState
  ) => {
    state.stack.push({
      card: card,
      activatedEvent: false
    });
    state.topCard = card;

    const cardIndex = state.decks[playerId].findIndex(
      c => c.type === card.type && c.color === card.color
    );
    state.decks[playerId].splice(cardIndex, 1);
  };

  public applyRule = (
    state: GameState,
    event: UIClientEvent,
    pile: CardDeck
  ) => {
    if (event.event !== UIEventTypes.tryPlaceCard) {
      return {
        newState: state,
        moveCount: 0
      };
    }

    const allowed = BasicGameRule.canThrowCard(
      <Card>event.payload.card,
      state.topCard,
      state.stack[state.stack.length - 1].activatedEvent
    );

    if (allowed) {
      BasicGameRule.placeCard(<Card>event.payload.card, event.playerId, state);
    }

    return {
      newState: state,
      moveCount: allowed ? 1 : 0
    };
  };

  getEvents = (state: GameState, event: UIClientEvent) =>
    event.event !== UIEventTypes.tryPlaceCard
      ? []
      : [
          placeCardEvent(
            event.playerId,
            <Card>event.payload.card,
            event.payload.id,
            BasicGameRule.canThrowCard(
              <Card>event.payload.card,
              state.topCard,
              state.stack[state.stack.length - 1].activatedEvent
            )
          )
        ];
}
