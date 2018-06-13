import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';

interface CarouselProp {
  slideCount: number;
}

interface CarouselState {
  index: number;
}

class Carousel extends React.Component<CarouselProp, CarouselState> {
  timer?: number;

  state: CarouselState = {
    index: 0
  };

  startInterval = () => {
    if (this.timer) {
      window.clearInterval(this.timer);
    }

    this.timer = window.setInterval(this.handleInterval, 6000);
  }

  handleInterval = () => {
    const { slideCount } = this.props;

    this.setState(prevState => ({
      index: (prevState.index + 1) % slideCount
    }));
  }

  componentDidMount() {
    this.startInterval();
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
  }

  render() {
    const {children} = this.props;

    return (
      <SwipeableViews index={this.state.index}>
        {children}
      </SwipeableViews>
    );
  }
}

export default Carousel;