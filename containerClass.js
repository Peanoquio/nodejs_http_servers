class Container {
    
    /**
     * The class constructor
     * @param {Number} id 
     * @param {String} name 
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    /**
     * Get the id
     * @returns {Number}
     */
    getId() {
        return this.id;
    }

    /**
     * Get the name
     * @returns {String}
     */
    getName() {
        return this.name;
    }

} //end class


module.exports = Container;
