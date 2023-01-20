import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
    return (
        <button 
            className={props.winningSquares.some(square => square === props.square) ? "square winning" : "square"}
            onClick={props.onClick} // ? in function component, does not have to be {() => this.props.onClick()} 
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(row) {
        return ([0,1,2].map( square => {
            let squareNum = row + square;
            return (
                <Square // value and onClick are props being passed down from Board to child component Square
                    value={this.props.squares[squareNum]} 
                    onClick={() => this.props.onClick(squareNum, [row/3, square])}
                    key={squareNum}
                    location={[row, square]}
                    square={squareNum}
                    winningSquares={this.props.winningSquares}
                />
            );
        }))

    }

    render() {
        const rows = [0,3,6].map( row => {
            return (
                <div className="board-row" key={row}>
                    {this.renderSquare(row)}
                </div>
            )
    }) 

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: [null, null]
            }],
            stepNumber: 0,
            xIsNext: true,
            sortAscending: true,
            winningSquares: []
        }
    }

    handleClick(i, location) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{
                squares: squares,
                location: location,
                move: history.length || null
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        }); 
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2 === 0),
        });
    }

    render() {
        const history = this.state.sortAscending ? this.state.history : this.state.history.slice(0).reverse();
        const current = this.state.history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        // TODO-PW <<DONE>> reverse order of list of moves based on sortAsceding state
        const moves = history.map((step, move) => {
            const desc = step.move ?
            `Go to move # ${step.move} (${step.location})` :
            "Go to game start";
        return (
            <li key={move}>
                <button
                    onClick={() => this.jumpTo(step.move || move)}
                    className={step.move === this.state.stepNumber ? "active" : ""} // TODO-PW <<DONE>> not working properly for game start and latest move
                >{desc}</button>
            </li>
        );
        });

        let status;
        let winningSquares = [];
        if (winner) {
            status = `Winner: ${winner.winner}`;
            winningSquares = winner.winningSquares;
            // <<DONE>> TODO-PW highlight winnning squares
        } else if(this.state.stepNumber === 9) {
            status = "Game ends in a draw"
        } else {
            status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i, location) => this.handleClick(i, location)}
                        winningSquares={winningSquares}
                    />
                </div>
                <div className="game-info">
                    <div>
                        {status}
                    </div>
                    {/* TODO-PW <<DONE>> add onClick that changes state sortAscending */}
                    <button
                        onClick={() => this.setState({sortAscending : !this.state.sortAscending})}
                    >
                        {this.state.sortAscending ? "Ascending" : "Descending"}
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a], 
                winningSquares: [a, b, c]};
        }
    }
    return null;
}

// ==================================================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);