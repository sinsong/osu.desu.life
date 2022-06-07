import { h } from 'vue'
import feather from 'feather-icons'

export default {
  props: {
    color: String,
    size: String
  },
  setup (props) {
    const search = feather.icons.x

    const attrs = {
      ...search.attrs,
      innerHTML: search.contents
    }

    if (props.color && props.color.length !== 0) {
      attrs.stroke = props.color
    }

    if (props.size) {
      attrs.width = props.size
      attrs.height = props.size
    }

    return () => h(
      'svg',
      attrs
    )
  }
}
