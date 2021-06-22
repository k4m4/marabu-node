import { Socket } from 'net';
import type { Message } from '../types';
import { canonicalize } from '../utils/json';
import { PeerAddress } from './peers';
import type { Address } from './peers';

export interface IConnectionHandler {
	getAddress (): PeerAddress;
	sendPayload (payload: string): void;
	sendMessage (message: Message): void;
	end (): void;
}

class ConnectionHandler implements IConnectionHandler {
	private socket: Socket;
    private address: Address;

	constructor (socket: Socket, address?: Address) {
		this.socket = socket;
        this.address = address || this.socket.address() as Address; 
	}

	public getAddress (): PeerAddress {
        if (Object.keys(this.address).length === 0) {
            throw new Error('Could not resolve peer address');
        }

		return new PeerAddress(this.address);
	}

	public sendPayload (payload: string): void {
		this.socket.write(payload + '\n');
	}

	public sendMessage (message: Message): void {
        console.log(`Message sent to ${this.getAddress()}:`, { message });
		this.sendPayload(canonicalize(message));
	}

	public end (): void {
		this.socket.end();
	}
}

export default ConnectionHandler;
