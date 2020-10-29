import synthtool as s
import synthtool.gcp as gcp
import synthtool.languages.node as node
import logging
logging.basicConfig(level=logging.DEBUG)

AUTOSYNTH_MULTIPLE_COMMITS = True

common_templates = gcp.CommonTemplates()
templates = common_templates.node_library(source_location='build/src')
s.copy(templates, excludes=[
  ".kokoro/continuous/node12/common.cfg",
  ".kokoro/presubmit/node12/common.cfg"
])
node.install()
node.fix()
