// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductTracking {
    enum State { Created, Manufactured, ForSale, Sold, Shipped, Received, Verified }

    struct Product {
        uint256 id;
        string name;
        string description;
        address owner;
        State state;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCounter;

    event ProductCreated(uint256 id, string name, address owner);
    event StateUpdated(uint256 id, State state);
    event OwnershipTransferred(uint256 id, address newOwner);

    function createProduct(string memory _name, string memory _description) public {
        productCounter++;
        products[productCounter] = Product(productCounter, _name, _description, msg.sender, State.Created);
        emit ProductCreated(productCounter, _name, msg.sender);
    }

    function updateState(uint256 _productId, State _state) public {
        require(products[_productId].owner == msg.sender, "Only the owner can update the state");
        products[_productId].state = _state;
        emit StateUpdated(_productId, _state);
    }

    function transferOwnership(uint256 _productId, address _newOwner) public {
        require(products[_productId].owner == msg.sender, "Only the owner can transfer ownership");
        products[_productId].owner = _newOwner;
        emit OwnershipTransferred(_productId, _newOwner);
    }

    function verifyProduct(uint256 _productId) public view returns (Product memory) {
        return products[_productId];
    }
}
