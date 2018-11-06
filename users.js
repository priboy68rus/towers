class Users {
    constructor () {
        this.users = [];
    }
    
    addUser(id, name, room) {
        var user = {id, name, room, status:false};
        this.users.push(user);
        return user;
    }
    
    removeUser(id) {
        var user = this.users.filter((user) => user.id === id)[0];
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }
    
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    
    getUserList(room) {
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);
        return namesArray;
    }

    isRoomReady(room) {
        var statuses = this.users.filter((user) => user.room === room).map(user => user.status);
        if (statuses.includes(false))
            return false;
        return true;
    }

    getFreeRooms() {
        var rooms = this.users.map(user => user.room);
        var ans = [];
        var new_rooms = compressArray(rooms);

        for (var i = 0; i < new_rooms.length; i++) {
            if (new_rooms[i].count == 1) {
                ans.push(new_rooms[i]);
            }
        }
        return ans;
    }
    
}

function compressArray(original) {
 
	var compressed = [];
	// make a copy of the input array
	var copy = original.slice(0);
 
	// first loop goes over every element
	for (var i = 0; i < original.length; i++) {
 
		var myCount = 0;	
		// loop over every element in the copy and see if it's the same
		for (var w = 0; w < copy.length; w++) {
			if (original[i] == copy[w]) {
				// increase amount of times duplicate is found
				myCount++;
				// sets item to undefined
				delete copy[w];
			}
		}
 
		if (myCount > 0) {
			var a = new Object();
			a.value = original[i];
			a.count = myCount;
			compressed.push(a);
		}
	}
 
	return compressed;
};

module.exports = {Users};