const { useState, useEffect, Fragment } = React;
const { useSpring, animated } = ReactSpringHooks;

const useFetchQuestions = () => {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const setNewQuestions = async () => {
    const response = await fetch("https://opentdb.com/api.php?amount=9&difficulty=easy");
    const data = await response.json();
    const formattedQuestions = formatQuestions(data.results);
    setQuestions(formattedQuestions);
    setLoading(false);
  };

  const formatQuestions = rawQuestions => {
    let formattedQuestions = [];
    for (let i = 0; i < rawQuestions.length; i++) {
      formattedQuestions.push({
        ...rawQuestions[i],
        choices: [
        ...rawQuestions[i].incorrect_answers, rawQuestions[i].correct_answer].
        reduce((a, v) => a.splice(Math.floor(Math.random() * a.length), 0, v) && a, []) });

    }
    return formattedQuestions;
  };

  useEffect(() => {
    setNewQuestions();
  }, []);

  return { questions, loading, setNewQuestions };
};

const Card = ({
  question, id, trans, index }) =>
{
  const [showBack, set] = useState(false);

  const { opacity, transform } = useSpring({
    opacity: showBack ? 1 : 0,
    transform: `perspective(1000px) rotate${trans}(${showBack ? 180 : 0}deg)`,
    config: { mass: 10, tension: 500, friction: 80 } });


  useEffect(() => {
    const showBack = () => set(true);
    const hideBack = () => set(false);
    const el = document.querySelector(`#${id}`);
    el.addEventListener('mouseenter', showBack);
    el.addEventListener('mouseleave', hideBack);
    return () => {
      el.removeEventListener('mouseenter', showBack);
      el.removeEventListener('mouseleave', hideBack);
    };
  }, []);


  return /*#__PURE__*/(
    React.createElement("div", { id: id, className: "Card" }, /*#__PURE__*/
    React.createElement(animated.div, {
      className: `flip front color-${index}`,
      style: {
        opacity: opacity.interpolate(o => 1 - o),
        transform } }, /*#__PURE__*/


    React.createElement("div", { className: "question" },
    he.decode(question.question)), /*#__PURE__*/

    React.createElement("ul", { className: "choices" },
    question.choices.map((choice) => /*#__PURE__*/
    React.createElement("li", null, he.decode(choice))))), /*#__PURE__*/



    React.createElement(animated.div, {
      className: `flip back color-${index}`,
      style: {
        opacity,
        transform: transform.interpolate(
        t => `${t} rotate${trans}(180deg)`) } },



    he.decode(question.correct_answer))));



};

const App = () => {
  const { questions, loading, setNewQuestions } = useFetchQuestions();

  return /*#__PURE__*/(
    React.createElement("div", { className: "Cards" }, /*#__PURE__*/
    React.createElement("div", { className: "CardsWrapper" },
    loading && /*#__PURE__*/React.createElement("div", { className: "loader" }, "Loading"),
    questions && /*#__PURE__*/
    React.createElement(Fragment, null,
    questions.map((question, index) => /*#__PURE__*/
    React.createElement(Card, {
      key: index,
      question: question,
      id: `card${index}`,
      trans: index % 2 === 0 ? "X" : "Y",
      index: index })), /*#__PURE__*/


    React.createElement("div", {
      className: "Card",
      role: "button",
      onClick: setNewQuestions }, /*#__PURE__*/

    React.createElement("div", { className: "flip reset" }, /*#__PURE__*/
    React.createElement("i", { class: "fas fa-sync" }), "Get New Questions"))))));








};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('app'));