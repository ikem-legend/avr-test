// @flow
import * as layoutConstants from '../../constants/layout'
import {
  CHANGE_LAYOUT,
  CHANGE_LAYOUT_WIDTH,
  CHANGE_SIDEBAR_THEME,
  CHANGE_SIDEBAR_TYPE,
  TOGGLE_RIGHT_SIDEBAR,
  SHOW_RIGHT_SIDEBAR,
  HIDE_RIGHT_SIDEBAR,
  SHOW_FEEDBACK,
  SHOW_FEEDBACK_SUCCESS,
  SHOW_FEEDBACK_ERROR,
  HIDE_FEEDBACK,
} from './constants'

const INIT_STATE = {
  layoutType: layoutConstants.LAYOUT_VERTICAL,
  layoutWidth: layoutConstants.LAYOUT_WIDTH_FLUID,
  leftSideBarTheme: layoutConstants.LEFT_SIDEBAR_THEME_DEFAULT,
  leftSideBarType: layoutConstants.LEFT_SIDEBAR_TYPE_FIXED,
  showRightSidebar: false,
  feedbacks: [],
}

const Layout = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_LAYOUT:
      return {
        ...state,
        layoutType: action.payload,
      }
    case CHANGE_LAYOUT_WIDTH:
      return {
        ...state,
        layoutWidth: action.payload,
      }
    case CHANGE_SIDEBAR_THEME:
      return {
        ...state,
        leftSideBarTheme: action.payload,
      }
    case CHANGE_SIDEBAR_TYPE:
      return {
        ...state,
        leftSideBarType: action.payload,
      }
    case TOGGLE_RIGHT_SIDEBAR:
      return {
        ...state,
        showRightSidebar: !state.showRightSidebar,
      }
    case SHOW_RIGHT_SIDEBAR:
      return {
        ...state,
        showRightSidebar: true,
      }
    case HIDE_RIGHT_SIDEBAR:
      return {
        ...state,
        showRightSidebar: false,
      }
    case SHOW_FEEDBACK:
      return {
        ...state,
      }
    case SHOW_FEEDBACK_SUCCESS:
      // console.log(action)
      const {message, id, color} = action.payload
      return {
        ...state,
        feedbacks: [].concat({message, id, color}),
      }
    case SHOW_FEEDBACK_ERROR:
      return {
        ...state,
        error: action.payload
      }
    case HIDE_FEEDBACK:
      return {
        ...state,
        feedbacks: state.feedbacks.filter(error => error.id !== action.id), // review for possible return value of number
      }
    default:
      return state
  }
}

export default Layout
