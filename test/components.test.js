
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
import LeaderBoard from '../src/client/components/leaderBoard/leaderBoard'
import PlayerForm from '../src/client/components/playerForm/playerForm'
import ShadowBoard from '../src/client/components/shadowBoard/shadowBoard'
import Instructions from '../src/client/components/instructions/instructions'
import InstructionItem from '../src/client/components/instructions/instructionItem/instructionItem'


describe('board component', function () {
	let wrapper = null;
	let props = {};

	it('should contain <div>EMPTY BOARD</div> gameState is undefined', function () {
		props = { gameState: undefined };
		wrapper = shallow(<Board {...props}/>)
		expect(wrapper).contains(shallow(<div>EMPTY BOARD</div>));
	});

	it('should contain <div>EMPTY BOARD</div> gameState.cells is undefined', function () {
		props = { gameState: {cells: undefined} };
		wrapper = shallow(<Board {...props}/>)
		expect(wrapper).contains(shallow(<div>EMPTY BOARD</div>));
	});

	it('should contain 1 divs + number of cells + number of rows' , function () {
		props = { gameState: { cells: [[0, 0, 0],[1, 1, 1]] } };
		wrapper = shallow(<Board {...props}/>)
		expect(wrapper.find('div')).to.have.lengthOf(9);
	});
});

describe('button component', function () {
	let wrapper = null;
	let props = {};

	it('should call onClick function on click', function () {
		const onClick = sinon.spy();
		props = { onClick };
		wrapper = shallow(<Button {...props}/>);
		wrapper.find('input').simulate('click');
		expect(onClick).to.have.property('callCount', 1);
	});
});

describe('endGameLeaderBoard component', function () {
	let wrapper = null;
	let props = {
		// uuid: 1,
		// playersInfo: new Map(), //map
		// isWinnerByScore: true,
		// isWinner: true
	};

	it('should have only one div when no props are passed', function () {
		wrapper = shallow(<EndGameLeaderBoard {...props}/>);
		expect(wrapper.find('div')).to.have.lengthOf(1);
	});

	let playerInfo1 = { id: 1, name: '1', score: 40 };
	let playerInfo2 = { id: 2, name: '2', score: 20 };

	it('should have <h2>You win!</h2> if player won', function () {
		let playersInfo = new Map();
		playersInfo.set(1, playerInfo1);
		playersInfo.set(2, playerInfo2);
		props = {
			uuid: 1,
			playersInfo,
			isWinner: true,
			isWinnerByScore: true
		}
		wrapper = shallow(<EndGameLeaderBoard {...props}/>);
		expect(wrapper.find('h2').text()).equal('You win!');
	});

	it('should have <h2>You lose...</h2> if player lost multiplayer', function () {
		let playersInfo = new Map();
		playersInfo.set(1, playerInfo1);
		playersInfo.set(2, playerInfo2);
		props = {
			uuid: 1,
			playersInfo,
			isWinner: false,
			isWinnerByScore: true
		}
		wrapper = shallow(<EndGameLeaderBoard {...props}/>);
		expect(wrapper.find('h2').text()).equal('You lose...');
	});

	it('should have <h2>You lose...</h2> if player lost singleplayer', function () {
		let playersInfo = new Map();
		playersInfo.set(1, playerInfo1);
		props = {
			uuid: 1,
			playersInfo,
			isWinner: false,
			isWinnerByScore: true
		}
		wrapper = shallow(<EndGameLeaderBoard {...props}/>);
		expect(wrapper.find('h2').text()).equal('You lose...');
	});

	it('should have a * in front of player name if won by score', function () {
		let playersInfo = new Map();
		playersInfo.set(1, playerInfo1);
		playersInfo.set(2, playerInfo2);
		let playersLostList = [
			1, 2
		];
		props = {
			uuid: 1,
			playersInfo,
			isWinner: false,
			isWinnerByScore: true,
			playersLostList
		}
		wrapper = shallow(<EndGameLeaderBoard {...props}/>);
		expect(wrapper.find('span').first().text()[0]).equal('*');
	});
});
//
describe('GameData component', function () {
	let wrapper = null;
	let props = {
		// gameData: {}
	};

	it('should render nothing if no gameData is present', function () {
		wrapper = shallow(<GameData {...props}/>);
		expect(wrapper.exists('div')).equals(false);
	});

	it('should render stuff when gameData is present', function () {
		props = {
			gameData: {}
		};
		wrapper = shallow(<GameData {...props}/>);
		expect(wrapper.exists('div')).equals(true);
	});
});

describe('NextPieces component', function () {
	let wrapper = null;
	let props = {
		// pieces: {}
	};

	it('should render something if no pieces is present', function () {
		wrapper = shallow(<NextPieces {...props}/>);
		expect(wrapper.exists('div')).equals(true);
	});

	it('should render stuff when pieces is present', function () {
		props = {
			pieces: [ { cells: [[0, 0], [1, 1]] } ]
		};
		wrapper = shallow(<NextPieces {...props}/>);
		expect(wrapper.exists('div')).equals(true);
	});
});

describe('SavedPiece component', function () {
	let wrapper = null;
	let props = {
		// pieces: {}
	};

	it('should always render', function () {
		wrapper = shallow(<SavedPiece {...props}/>);
		expect(wrapper.exists('div')).equals(true);
	});

	it('should render stuff when pieces are present', function () {
		props = {
			piece: { cells: [[0, 0, 0, 0], [1, 1, 1, 1], [2, 2, 2, 2], [2, 2, 2, 2]] }
		};
		wrapper = shallow(<SavedPiece {...props}/>);
		expect(wrapper.exists('div')).equals(true);
	});

	it('should render something on invalid piece', function () {
		props = {
			piece: { cells: [[0, 0, 0, 0], [1, 1, 1], [2, 2, 2, 2], [2, 2, 2, 2]] }
		};
		wrapper = shallow(<SavedPiece {...props}/>);
		expect(wrapper.exists('div')).equals(true);
	});
});

describe('HeaderBar component', function () {
	let wrapper = null;

	it('should always render', function () {
		wrapper = shallow(<HeaderBar />);
		expect(wrapper.exists('div')).equals(true);
	});
});

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
		id: 1,
		hostName: "hostName",
		playerCount: 1
	}
	it('should contain at least one <Host> if hostList.length > 0', function () {
		props = {
			hostList: [ host1 ],
			gameSelected: null
		}
		wrapper = mount(<HostList {...props}/>);
		expect(wrapper.find(Host).length).equals(1);
	});

	it('should call joinGame on click', function () {
		let onClick = sinon.spy();
		props = {
			hostList: [ host1 ],
			gameSelected: true,
			joinGame: onClick
		}
		wrapper = mount(<HostList {...props}/>);
		wrapper.find('input[type="button"]').simulate('click');
		expect(onClick).to.have.property('callCount', 1);
	});
});

describe('Host component', function() {
	let wrapper = null;
	let props = {
		// selectGame: fn,
		// host: Host,
	};

	let host1 = {
		id: 1,
		hostName: "hostName",
		playerCount: 1
	}
	it('should not render if no host is passed', function () {
		wrapper = shallow(<Host />);
		expect(wrapper.exists('div')).equals(false);
	});

	it('should display four divs if host is passed', function () {
		props = {
			onClick: null,
			host: host1
		};
		wrapper = shallow(<Host {...props}/>);
		expect(wrapper.find('div').length).equals(4);
	});

	it('should call callback on click', function () {
		let onClick = sinon.spy();

		props = {
			selectGame: onClick,
			host: host1
		};
		wrapper = mount(<Host {...props}/>);
		wrapper.find(Host).simulate('click');
		expect(onClick).to.have.property('callCount', 1);
	});
});

describe('LeaderBoard component', function () {
	let wrapper = null;
	let props = {
		// players: []
	};

	let player1 = {
		playerName: "ThéoBuerk",
		score: 40
	};

	it('should always render', function () {
		wrapper = shallow(<LeaderBoard />);
		expect(wrapper.exists('div')).equals(true);
	});
	it('should contain two spans per player', function () {
		props = {
			players: [ player1 ]
		};

		wrapper = shallow(<LeaderBoard {...props}/>);
		expect(wrapper.find('span').length).equals(2);
	});
});

describe('PlayerForm component', function () {
	let wrapper = null;
	let props = {
		// onUpdateName: fn
	};

	it('should always render', function () {
		wrapper = shallow(<PlayerForm />);
		expect(wrapper.exists('div')).equals(true);
	});

	it('should call callback on click', function () {
		let onClick = sinon.spy();

		props = {
			onUpdateName: onClick
		};
		wrapper = mount(<PlayerForm {...props}/>);
		wrapper.find('input[type="button"]').simulate('click');
		expect(onClick).to.have.property('callCount', 1);
	});

	it('should call callback on enter', function () {
		let onClick = sinon.spy();

		props = {
			onUpdateName: onClick
		};
		wrapper = mount(<PlayerForm {...props}/>);
		wrapper.find('input[type="text"]').simulate('keyDown', {keyCode: 13});
		expect(onClick).to.have.property('callCount', 1);
	});
});

describe('ShadowBoard component', function () {
	let wrapper = null;
	let props = {
		// shadowState: [],
		// playerUUID
	};


	it('should always render', function () {
		wrapper = shallow(<ShadowBoard {...props}/>);
		expect(wrapper.find('div').length).equals(1);
	});

	it('should not render more if shadowState is the player\'s', function () {
		let shadowState = new Map();
		shadowState.set(1, {
			id: 1,
			name: 'name',
			board: [[0, 0], [1, 1]],
			score: 40
		});
		props = {
			shadowState,
			playerUUID: 1
		};
		wrapper = shallow(<ShadowBoard {...props}/>);
		expect(wrapper.find('div').length).equals(1);
	});

	it('should render more than 1 div if shadowBoard not player\'s', function () {
		let shadowState = new Map();
		shadowState.set(1, {
			id: 1,
			name: 'name',
			board: [[0, 0], [1, 1]],
			score: 40
		});
		props = {
			shadowState,
			playerUUID: 2
		};
		wrapper = shallow(<ShadowBoard {...props}/>);
		expect(wrapper.find('div').length).to.be.gt(1);
	});
});

describe('Instructions component', function () {
	let wrapper = null;

	it('should always render', function () {
		wrapper = shallow(<Instructions	/>);
		expect(wrapper.find('h3').length).equals(1);
	});
});

describe('Instruction Item component', function () {
	let wrapper = null;


	it('should always render if has instruction', function () {
		let props = {
			instruction: {
				name: "test",
				instruction: "test"
			}
		};
		wrapper = shallow(<InstructionItem	{...props}/>);
		expect(wrapper.find('div').length).equals(3);
	});

	it('should not render if has no instruction', function () {
		let props = {};
		wrapper = shallow(<InstructionItem	{...props}/>);
		expect(wrapper.find('div').length).equals(0);
	});
});
