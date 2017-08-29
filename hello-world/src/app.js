import { h1, div, label, input, span } from '@cycle/dom'
import xs from 'xstream'

export function App (sources) {
  const actions = intent(sources.DOM);
  const state$ = model(actions);
  const vdom$ = view(state$);

  return {
    DOM: vdom$
  }
}

function intent(domSource) {
  const leftInput$ = domSource.select('#left-input')
      .events('input')
      .map(event => event.target.value || 0)
      .map(parseInt)
      .startWith(0);
  
  const rightInput$ = domSource.select('#right-input')
      .events('input')
      .map(event => event.target.value || 0)
      .map(parseInt)
      .startWith(0);

  return { leftInput$, rightInput$ };
}

function model(actions) {
  const { leftInput$, rightInput$ } = actions;

  return xs.combine(leftInput$, rightInput$)
      .map(([leftValue, rightValue]) => {
        const value = leftValue + rightValue;
        return { value };
      });
}

function view(state$) {
  return state$.map(state => 
    div([
      h1('hello world app'),
      div('container', [
        label('left'),
        input('#left-input', {attrs: {type: 'text'}}),
        span('+'),
        label('right'),
        input('#right-input', {attrs: {type: 'text'}}),
        span('='),
        label('result'),
        input('#result-output', {attrs: {type: 'text', value: state.value}}),
      ])
    ])
  );
}