import React, { PropTypes as T } from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

export class InfoWindow extends React.Component {

  componentDidMount() {
    this.renderInfoWindow();
  }

  componentDidUpdate(prevProps) {
    const {google, map} = this.props;

    if (!google || !map) {
      return;
    }

    if (map !== prevProps.map) {
      this.renderInfoWindow();
    }

    if (this.props.children !== prevProps.children) {
      this.updateContent();
    }

    if ((this.props.visible !== prevProps.visible ||
        this.props.marker !== prevProps.marker)) {
        this.props.visible ?
          this.openWindow() :
          this.closeWindow();
    }
  }

  renderInfoWindow() {
    let {map, google, mapCenter} = this.props;

    if (!google || !google.maps) {
      return;
    }

    const iw = this.infowindow = new google.maps.InfoWindow({
      content: ''
    });

    google.maps.event
      .addListener(iw, 'closeclick', this.onClose.bind(this))
    google.maps.event
      .addListener(iw, 'domready', this.onOpen.bind(this));
  }

  onOpen() {
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  openWindow() {
    console.log('iw openWindow');
    this.infowindow.open(this.props.map, this.props.marker);
  }

  updateContent() {
    console.log('iw updateContent');
    const content = this.renderChildren();
    this.infowindow.setContent(content);
  }

  closeWindow() {
    console.log('iw closeWindow');
    this.infowindow.close();
  }

  renderChildren() {
    const {children} = this.props;

    const html = ReactDOMServer.renderToString(children);

    // TODO: save html?
    const html2 = '<button onClick="handleDetailsClicked(\''+this.props.userId+'\')" class="ui black icon button"><i aria-hidden="true" class="angle double right icon"></i> </button>'

    // const html = ReactDOMServer.renderToStaticMarkup()(children);

    const finalHtml = '<div>'+html+html2+'</div>';

    console.log('iw renderChildren', this.props);
    console.log('iw renderChildren', finalHtml);

    return finalHtml;
  }

  render() {
    console.log('iw render');
    return null;
  }
}

InfoWindow.propTypes = {
  children: T.element.isRequired,
  map: T.object,
  marker: T.object,
  visible: T.bool,

  // user id
  userId: T.string,

  // callbacks
  onClose: T.func,
  onOpen: T.func
}

InfoWindow.defaultProps = {
  visible: false
}

export default InfoWindow
