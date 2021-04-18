import React, { Component } from 'react';
import './swappable.css';

class Swappable extends Component {
  constructor() {
    super();

    this.state = {
      customFunc: null,
    };
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev, customFunc = null) {
    ev.dataTransfer.setData('src', ev.target.id);

    this.setState({
      initialParentNode: ev.target.parentNode,
    });
  }

  dragEnd(ev, customFunc = null) {
    if (customFunc && ev.target.parentNode != this.state.initialParentNode) {
      this.props.customFunc();
    }
  }

  drop(ev, dragableId, dropzoneId, customFunc = null, swappable = true) {
    if (swappable == false) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    let src = document.getElementById(ev.dataTransfer.getData('src'));
    if (src == null) {
      return;
    }
    let srcParent = src.parentNode;

    let target = document.getElementById(dragableId);
    let targetParent = target.parentNode;

    if (swappable) this.swapElements(src, target, srcParent, targetParent);
  }

  swapElements(src, target, srcParent, targetParent) {
    let sourceIndexArray = src.id.split(':');
    let targetIndexArray = target.id.split(':');

    const isCurrentSwappable = this.props.isCurrentSwappable(src.id, target.id);

    if (sourceIndexArray[2] === targetIndexArray[2] && isCurrentSwappable) {
      //target.replaceWith(src);
      //srcParent.appendChild(target);
      this.props.onSwap(src.id, target.id);
    }
  }

  render() {
    const { id, swappable, customFunc } = this.props;
    const dropzoneId = 'drop' + id;
    // const dragableId = 'drag' + id;
    const dragableId = id;
    return (
      <div
        className="dropzoneId w-100"
        id={dropzoneId}
        onDrop={event => this.drop(event, dragableId, dropzoneId, customFunc, swappable)}
        onDragOver={event => this.allowDrop(event)}
      >
        <div
          className="dragableId w-100"
          id={dragableId}
          draggable={swappable}
          onDragStart={event => this.drag(event)}
          onDragEnd={event => this.dragEnd(event, customFunc)}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Swappable;
