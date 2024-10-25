import { useState, useEffect } from 'react';
import pokemonData from '../../data/generation1.json';
import './ClassicGame.css';

function ClassicGame() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [validPokemonList, setValidPokemonList] = useState([]);
  const [solution, setSolution] = useState(null);
  const [foundPokemon, setFoundPokemon] = useState(null);
  const [hints, setHints] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hintCount, setHintCount] = useState(0);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * pokemonData.length);
    const chosenSolution = pokemonData[randomIndex];
    setSolution(chosenSolution);
    console.log(chosenSolution); // Print the solution in the console
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filteredSuggestions = pokemonData
        .filter(pokemon =>
          pokemon.name.toLowerCase().includes(value.toLowerCase()) &&
          !validPokemonList.some(validPokemon => validPokemon.name === pokemon.name)
        )
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => (prevIndex - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSuggestionClick(suggestions[selectedIndex]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      const match = suggestions[0];
      setValidPokemonList([match, ...validPokemonList]); // Add new entry to the top
      setInputValue('');
      setSuggestions([]);
      if (match.name === solution.name) {
        setFoundPokemon(match);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setValidPokemonList([suggestion, ...validPokemonList]); // Add new entry to the top
    setInputValue('');
    setSuggestions([]);
    if (suggestion.name === solution.name) {
      setFoundPokemon(suggestion);
    }
  };

  const getCellColorAndArrow = (guessStat, solutionStat) => {
    const difference = Math.abs(guessStat - solutionStat);
    let arrow = '';
    let backgroundColor = '';

    if (difference > 50) {
      arrow = '↑↑↑';
      backgroundColor = '#FFCCCC'; // Light red
    } else if (difference > 25) {
      arrow = '↑↑';
      backgroundColor = '#FFDD99'; // Light orange
    } else if (difference > 5) {
      arrow = '↑';
      backgroundColor = '#FFFF99'; // Light yellow
    } else if (difference > 0) {
      arrow = '↑🔥';
      backgroundColor = '#CCFFCC'; // Light green
    }

    if (guessStat === solutionStat) return { backgroundColor: '#90EE90', arrow: '' }; // Light green for correct
    return guessStat < solutionStat
      ? { backgroundColor, arrow } // Up arrow with background color
      : { backgroundColor, arrow: arrow.replace(/↑/g, '↓') }; // Down arrow with background color
  };

  const handleShowHint = () => {
    if (solution && hintCount < 5) {
      const hintOptions = [
        `It's type is not ${getRandomTyping()}`,
        `It's height resembles ${getRealWorldAnimal(solution.profile.height)}`,
        `You can find ${getRandomObjectInHabitat(solution.habitat)} in its habitat`,
        `It's name has ${getSyllableCount(solution.name)} syllables`,
        `It's color is ${isRainbowColor(solution.color)} in the rainbow`
      ];
      const nextHint = hintOptions[hintCount];
      setHints([...hints, nextHint]);
      setHintCount(hintCount + 1);
    }
  };

  const getRandomTyping = () => {
    const allTypes = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];
    const solutionTypes = solution.profile.egg; // Assuming egg types are similar to Pokémon types
    const nonSolutionTypes = allTypes.filter(type => !solutionTypes.includes(type));
    return nonSolutionTypes[Math.floor(Math.random() * nonSolutionTypes.length)];
  };

  const getRealWorldAnimal = (height) => {
    const heightInMeters = parseFloat(height);
    if (heightInMeters < 0.3) return "a small insect";
    if (heightInMeters < 0.5) return "a small bird";
    if (heightInMeters < 1) return "a cat";
    if (heightInMeters < 1.5) return "a dog";
    if (heightInMeters < 2) return "a human child";
    if (heightInMeters < 3) return "an adult human";
    if (heightInMeters < 5) return "a small tree";
    if (heightInMeters < 8.8) return "a large tree";
    return "a very large tree";
  };

  const habitatItems = {
    "waters-edge": ["seashell", "driftwood", "algae"],
    "urban": ["trash", "pigeon feather", "concrete"],
    "sea": ["coral", "seaweed", "fish scale"],
    "grassland": ["wildflower", "tall grass", "butterfly"],
    "cave": ["stalactite", "bat guano", "glowing moss"],
    "rare": ["crystal", "ancient artifact", "mysterious stone"],
    "forest": ["acorn", "mushroom", "pine cone"],
    "rough-terrain": ["rock", "cactus", "sand"],
    "mountain": ["rock", "eagle feather", "snow"]
  };

  const getRandomObjectInHabitat = (habitat) => {
    const items = habitatItems[habitat] || ["unknown object"];
    return items[Math.floor(Math.random() * items.length)];
  };

  const getSyllableCount = (name) => {
    return name.toLowerCase().split(/[^aeiouy]+/).filter(Boolean).length;
  };

  const isRainbowColor = (color) => {
    const rainbowColors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
    return rainbowColors.includes(color.toLowerCase()) ? "seen" : "not seen";
  };

  return (
    <div>
      <h2>Classic Game</h2>
      {foundPokemon ? (
        <div>
          <img src={foundPokemon.image.thumbnail} alt={foundPokemon.name} />
        </div>
      ) : (
        <div>
          <div className="hints-container">
            {hints.map((hint, index) => (
              <div key={index} className="hint-item">{hint}</div>
            ))}
          </div>
          {hintCount < 5 && <button onClick={handleShowHint}>Show Hint</button>}
          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your guess"
              className="input-box"
            />
          </form>
          <div className="suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <img src={suggestion.image.sprite} alt={suggestion.name} />
                <span>{suggestion.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <table>
        <thead>
        <tr>
          <th>Sprite</th>
          <th>HP</th>
          <th>Attack</th>
          <th>Defense</th>
          <th>Sp. Attack</th>
          <th>Sp. Defense</th>
          <th>Speed</th>
        </tr>
        </thead>
        <tbody>
        {validPokemonList.map((pokemon, index) => (
          <tr key={index}>
            <td><img src={pokemon.image.thumbnail} alt={pokemon.name} /></td>
            {['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'].map(stat => {
              const { backgroundColor, arrow } = getCellColorAndArrow(pokemon.base[stat], solution.base[stat]);
              return (
                <td key={stat} style={{ backgroundColor }}>
                  {pokemon.base[stat]} {arrow}
                </td>
              );
            })}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassicGame;