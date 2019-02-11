class Container {
    
    /**
     * The class constructor
     * @param {number} id 
     * @param {string} name 
     * @param {number} msgId
     * @param {string} msg
     */
    constructor(id, name, msgId, msg) {
        this.id = id;
        this.name = name;
        this.msgId = msgId;
        this.msg = msg;
    }

    /**
     * Get the id
     * @returns {number}
     */
    getId() {
        return this.id;
    }

    /**
     * Get the name
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     * Get the message id
     * @returns {number}
     */
    getMsgId() {
        return this.msgId;
    }

    /**
     * Get the message
     * @returns {string}
     */
    getMsg() {
        return this.msg;
    }

} //end class


module.exports = Container;
