import React from 'react';
import { Segment, Grid } from 'semantic-ui-react';
import { TokenProvider, ChatManager } from '@pusher/chatkit';
import Rooms from './Rooms';
import Chat from './Chat';
export default class Games extends React.Component {
    state = {
        joined: [],
        joinable: []
    };
    constructor(props) {
        super(props);
        this.chatManager = new ChatManager({
            instanceLocator:'v1:us1:f70c1694-4f22-4537-bd13-a2d660ca277b',
            tokenProvider: new TokenProvider({
                url: "http://localhost:4000/auth",
            }),
            userId: props.username
        });
        this.chatManager.connect().then(currentUser => {
            this.setState({
                currentUser: currentUser
            });
            currentUser.getJoinableRooms().then((rooms) => {
                let lobby = rooms.find(room => room.name === 'Lobby');
                if (lobby) {
                    currentUser.joinRoom({ roomId: lobby.id });
                } else {
                    lobby = currentUser.rooms.find(room => room.name === 'Lobby');
                }
                if (lobby) {
                    this.setState({
                        lobbyId: lobby.id,
                        activeRoom: lobby.id
                    });
                }
            });
            setInterval(this._pollRooms.bind(this), 5000);
            this._pollRooms();
        }).catch((e) => {
            console.log('Failed to connect to Chatkit');
            console.log(e);
        });
    }
    _pollRooms() {
        const { currentUser } = this.state;
        currentUser.getJoinableRooms()
            .then((rooms) => {
                this.setState({
                    joined: currentUser.rooms,
                    joinable: rooms
                })
            });
    }
    _enterRoom(id) {
        const { currentUser } = this.state;
        currentUser.joinRoom({ roomId: id })
            .then(() => {
                this.setState({
                    activeRoom: id
                });
                this._pollRooms();
            })
            .catch(() => {
                console.log('Failed to enter room');
            });
    }
    _leaveRoom(id) {
        const { currentUser } = this.state;
        currentUser.leaveRoom({ roomId: id })
            .then(() => {
                this._pollRooms();
            })
            .catch(() => {
                console.log('Failed to leave room');
            });
    }
    _challengePlayer(player) {
        const { user, room } = this.props;
        user.sendMessage({
            text: `I challenge ${player.name} to a game`,
            roomId: room.id,
            attachment: {
                link: `urn:player:${player.id}`,
                type: 'file',
                fetchRequired: false
            }
        });
    }
    _acceptChallenge(player) {
        console.log(player);
    }
        render() {
            const { currentUser } = this.state;
            let chat;
            if (currentUser) {
                const room = currentUser.rooms.find((room) => room.id === this.state.activeRoom);
                if (room) {
                    chat = <Chat user={currentUser} room={room} key={room.id} />
                }
            }
            return (
                <Segment>
                    <Grid>
                        <Grid.Column width={4}>
                            <Rooms joined={this.state.joined}
                                   joinable={this.state.joinable}
                                   activeRoom={this.state.activeRoom}
                                   enterRoom={this._enterRoom.bind(this)}
                                   leaveRoom={this._leaveRoom.bind(this)} />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            { chat }
                        </Grid.Column>
                    </Grid>
                </Segment>
            );
        }
    }
