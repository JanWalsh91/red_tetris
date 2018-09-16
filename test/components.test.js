
import React from 'react'
import { expect, assert } from 'chai'
import sinon from 'sinon'

// configure enzyme:
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15.4';
configure({ adapter: new Adapter() });

// components:
import Board from '../src/client/components/board/board'
import Button from '../src/client/components/button/button'
import EndGameLeaderBoard from '../src/client/components/endGameLeaderBoard/endGameLeaderBoard'
import GameData from '../src/client/components/gameData/gameData'
import NextPieces from '../src/client/components/gameData/nextPieces/nextPieces'
import SavedPiece from '../src/client/components/gameData/savedPiece/savedPiece'
import HeaderBar from '../src/client/components/headerBar/headerBar'
// broken bc window error
import HostList from '../src/client/components/hostList/hostList'
import Host from '../src/client/components/hostList/host/host'




// describe('board component', function () {
// 	let wrapper = null;
// 	let props = {};
//
// 	it('should contain <div>EMPTY BOARD</div> gameState is undefined', function () {
// 		props = { gameState: undefined };
// 		wrapper = shallow(<Board {...props}/>)
// 		expect(wrapper).contains(shallow(<div>EMPTY BOARD</div>));
// 	});
//
// 	it('should contain <div>EMPTY BOARD</div> gameState.cells is undefined', function () {
// 		props = { gameState: {cells: undefined} };
// 		wrapper = shallow(<Board {...props}/>)
// 		expect(wrapper).contains(shallow(<div>EMPTY BOARD</div>));
// 	});
//
// 	it('should contain 1 divs + number of cells + number of rows' , function () {
// 		props = { gameState: { cells: [[0, 0, 0],[1, 1, 1]] } };
// 		wrapper = shallow(<Board {...props}/>)
// 		expect(wrapper.find('div')).to.have.lengthOf(9);
// 	});
// });
//
// describe('button component', function () {
// 	let wrapper = null;
// 	let props = {};
//
// 	it('should call onClick function on click', function () {
// 		const onClick = sinon.spy();
// 		props = { onClick };
// 		wrapper = shallow(<Button {...props}/>);
// 		wrapper.find('input').simulate('click');
// 		expect(onClick).to.have.property('callCount', 1);
// 	});
// });
//
// describe('endGameLeaderBoard component', function () {
// 	let wrapper = null;
// 	let props = {
// 		// uuid: 1,
// 		// playersInfo: new Map(), //map
// 		// isWinnerByScore: true,
// 		// isWinner: true
// 	};
//
// 	it('should have only one div when no props are passed', function () {
// 		wrapper = shallow(<EndGameLeaderBoard {...props}/>);
// 		expect(wrapper.find('div')).to.have.lengthOf(1);
// 	});
//
// 	let playerInfo1 = { id: 1, name: '1', score: 40 };
// 	let playerInfo2 = { id: 2, name: '2', score: 20 };
//
// 	it('should have <h2>You win!</h2> if player won', function () {
// 		let playersInfo = new Map();
// 		playersInfo.set(1, playerInfo1);
// 		playersInfo.set(2, playerInfo2);
// 		props = {
// 			uuid: 1,
// 			playersInfo,
// 			isWinner: true,
// 			isWinnerByScore: true
// 		}
// 		wrapper = shallow(<EndGameLeaderBoard {...props}/>);
// 		expect(wrapper.find('h2').text()).equal('You win!');
// 	});
//
// 	it('should have <h2>You lose...</h2> if player lost multiplayer', function () {
// 		let playersInfo = new Map();
// 		playersInfo.set(1, playerInfo1);
// 		playersInfo.set(2, playerInfo2);
// 		props = {
// 			uuid: 1,
// 			playersInfo,
// 			isWinner: false,
// 			isWinnerByScore: true
// 		}
// 		wrapper = shallow(<EndGameLeaderBoard {...props}/>);
// 		expect(wrapper.find('h2').text()).equal('You lose...');
// 	});
//
// 	it('should have <h2>You lose...</h2> if player lost singleplayer', function () {
// 		let playersInfo = new Map();
// 		playersInfo.set(1, playerInfo1);
// 		props = {
// 			uuid: 1,
// 			playersInfo,
// 			isWinner: false,
// 			isWinnerByScore: true
// 		}
// 		wrapper = shallow(<EndGameLeaderBoard {...props}/>);
// 		expect(wrapper.find('h2').text()).equal('You lose...');
// 	});
//
// 	it('should have a * in front of player name if won by score', function () {
// 		let playersInfo = new Map();
// 		playersInfo.set(1, playerInfo1);
// 		playersInfo.set(2, playerInfo2);
// 		props = {
// 			uuid: 1,
// 			playersInfo,
// 			isWinner: false,
// 			isWinnerByScore: true
// 		}
// 		wrapper = shallow(<EndGameLeaderBoard {...props}/>);
// 		expect(wrapper.find('span').first().text()[0]).equal('*');
// 	});
// });
//
// describe('GameData component', function () {
// 	let wrapper = null;
// 	let props = {
// 		// gameData: {}
// 	};
//
// 	it('should render nothing if no gameData is present', function () {
// 		wrapper = shallow(<GameData {...props}/>);
// 		expect(wrapper.exists('div')).equals(false);
// 	});
//
// 	it('should render stuff when gameData is present', function () {
// 		props = {
// 			gameData: {}
// 		};
// 		wrapper = shallow(<GameData {...props}/>);
// 		expect(wrapper.exists('div')).equals(true);
// 	});
// });
//
// describe('NextPieces component', function () {
// 	let wrapper = null;
// 	let props = {
// 		// pieces: {}
// 	};
//
// 	it('should render nothing if no pieces is present', function () {
// 		wrapper = shallow(<NextPieces {...props}/>);
// 		expect(wrapper.exists('div')).equals(false);
// 	});
//
// 	it('should render stuff when pieces is present', function () {
// 		props = {
// 			pieces: [ { cells: [[0, 0], [1, 1]] } ]
// 		};
// 		wrapper = shallow(<NextPieces {...props}/>);
// 		expect(wrapper.exists('div')).equals(true);
// 	});
// });
//
// describe('SavedPiece component', function () {
// 	let wrapper = null;
// 	let props = {
// 		// pieces: {}
// 	};
//
// 	it('should render nothing if no pieces is present', function () {
// 		wrapper = shallow(<SavedPiece {...props}/>);
// 		expect(wrapper.exists('div')).equals(false);
// 	});
//
// 	it('should render stuff when pieces is present', function () {
// 		props = {
// 			piece: { cells: [[0, 0, 0, 0], [1, 1, 1, 1], [2, 2, 2, 2], [2, 2, 2, 2]] }
// 		};
// 		wrapper = shallow(<SavedPiece {...props}/>);
// 		expect(wrapper.exists('div')).equals(true);
// 	});
//
// 	it('should render nothing on invalid piece', function () {
// 		props = {
// 			piece: { cells: [[0, 0, 0, 0], [1, 1, 1], [2, 2, 2, 2], [2, 2, 2, 2]] }
// 		};
// 		wrapper = shallow(<SavedPiece {...props}/>);
// 		expect(wrapper.exists('div')).equals(false);
// 	});
// });
//
// describe('HeaderBar component', function () {
// 	let wrapper = null;
//
// 	it('should always render', function () {
// 		wrapper = shallow(<HeaderBar />);
// 		expect(wrapper.exists('div')).equals(true);
// 	});
// });

// // TODO:
describe('HostList component', function () {
	let wrapper = null;
	let props = {
		// hostList: [],
		// gameSelected: bool,
		// onSelectGame: fn
	};

	it('should always render', function () {
		wrapper = shallow(<HostList />);
		expect(wrapper.exists('div')).equals(true);
	});

	let host1 = {
		id: 1
	}
	it('should contain at least one <Host> if hostList.length > 0', function () {
		props = {
			hostList: [ host1 ],
			gameSelected: null
		}
		wrapper = shallow(<HostList {...props}/>);
		console.log("is Host ? : ", wrapper.exists('Host'));
		expect(wrapper.exists('Host')).equals(true);
	});

});

// 		const onClick = sinon.spy();
// 		props = { onClick };
// 		wrapper = shallow(<Button {...props}/>);
// 		wrapper.find('input').simulate('click');
// 		expect(onClick).to.have.property('callCount', 1);
