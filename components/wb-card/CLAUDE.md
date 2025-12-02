# WB Card Component - TODO & Known Issues

## TODO Items

- [ ] **Slotted Content in Light DOM** - Figure out how to properly support `<slot>` or content projection in Light DOM cards
  - Currently, putting `<wb-controlpanel>` or other elements inside `<wb-card>` doesn't work as expected
  - Light DOM doesn't support `<slot>` the same way Shadow DOM does
  - Need to manually manage content projection or switch approach
  - Attempted fix: Save children before innerHTML, move to content div - but needs refinement
  - Status: Skipped for now, may revisit later
  
## Completed Features

✅ Template-based rendering (no Shadow DOM)  
✅ Video and image support with auto-detection  
✅ All variants (default, elevated, outlined, filled, glass)  
✅ All color themes (primary, secondary, success, warning, danger, info)  
✅ Card sizes (compact, standard, large)  
✅ Layouts (vertical, horizontal, image-right)  
✅ Clickable cards with selected state feedback  
✅ Videos auto-exit fullscreen when finished  
✅ Loading state animation  
✅ Footer support  
✅ Text-only cards  

## Notes

- Videos must use supported extensions: .mp4, .webm, .ogg, .mov, .avi, .mkv, .m4v
- jplayer.org/video URLs work reliably for testing
- Google CDN videos are CORS-blocked, use alternative sources
