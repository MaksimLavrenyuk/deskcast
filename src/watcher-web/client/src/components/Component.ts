type Ref = { current: null | Element };

abstract class Component<Props, State> {
  protected props: Props;

  protected state: State;

  protected readonly containerRef: Ref;

  /**
   * Redraw the element.
   * Since we don't have a diff mechanism for finding specific child modified catches, we replace the entire node.
   * @param ref
   * @param renderFunc
   */
  private static rerender(ref: Ref, renderFunc: () => Element) {
    if (ref.current) {
      const $el = ref.current;

      $el.replaceWith(renderFunc());
    }
  }

  protected constructor(props?: Props) {
    this.props = props;
    this.containerRef = { current: null };
    this.setState = this.setState.bind(this);
  }

  protected setContainerRef(ref: Element) {
    this.containerRef.current = ref;
  }

  protected setState(state: Partial<State>) {
    this.state = {
      ...this.state,
      ...state,
    };

    this.rerender();
  }

  private rerender() {
    Component.rerender(
      this.containerRef,
      () => this.render(),
    );
  }

  abstract render(): Element
}

export default Component;
