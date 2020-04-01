/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAAAzCAYAAADFAxXIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACdNJREFUeNrkWn1MG+cZP2Mbnx0DxgXikBBsTGjsdMQQKArdgmmatBN/hCzVumxTQ6p20aR0UaR9/VOxVdomTduSav+sazayatmaVlHpqnSjFQtNG9SuLKEkQJeFQEKXmBICARt8tuH2POf3zNk+352LQ7jtlc7n+3p97+/9Pb/n4zVFZaiV2x32+UhYOx8JxbZIGDcmKxJa3CgVNU0mOnGW2i2wGy4pWfdsR8dbp6X6ZylWQ75wn3C8oIldg/vZhXDsXrxHcIzNlFfAqA2cNrPZvPbc+53fig2Tje+fjftNNu5E/Huw8ecWb9UkPoTnWJYNAYoLi4+zDNxFjrmJwOscwFvqvLVD10a6lI5LlwFgvFqtds+BZ/Y9EQ4G8gRj1MQzJsUAWfFBC59iRfoTAv3tZ7/XNDV1p/jPL//2pfgJYRPBP5MOIXQZIE5rudNx6vFdXw6Eg7N5iS8exwXRAbIaKhlFTdzQxNglYKaJNqy6Pj3jDjOzlgRQYr/5p1fby2A3ks7AdEtkTTNNG9wv/fqnv+KBkTKBRSERN+vYs6w0k2LnyGFZ6bqZgU8uW0JC5iaAE/DP2JYVHGhHGupr26PAKDMBsRdPYFhKhqTqz1VRGjzxmt8Rz9x4k5qbDRSkOzjdUlizymTMPXxgbx+vNWwqIBSAxYqAJe402Nh9/F1fuN8ejkQiJjCr2CQlgnp99MYG2L27XMw59Mi22jM4W6wcQ2ImkIohSxHn6Pn78nPHTnd0Ve5sqL0mxkxtFkUvC3OANZ5svW5rU2PNb0LC2VIgumwKk5JiCLZ/XrpS8P5Hl5z/8d0qDDJhmgmFDBOT00UAymeG7Gxmxj9ruTh4paKxbtMU6TOuP4ZhcpfLrA5tdjku5xp1NJgUnVI4WQnRjQc0peie6vjA2XH2fLVGQ2WVri3ybXE7fKsLLX686C4vmRi4Mnoffr90+drk+f4rlU99/5cPPPqlqt6v7Ki7KuTb2PgECnLXcoDTvHt7zXsJrnsJOsJ5sTh2Tfvn9D//3ZtbGSZs2LOzdqCxzv1pMitZutZdMovfYD+0v/mLQ2f+MbD29Xd6avoGh50Hv77jQq6ZDpMf1N115qAQF1lztTarURcVwGQTkA/6pMGaDgR1Pzv21y3FhXmzB/c2foTnyEQkP5vwuw9Vlvo3O209R090Vv7kxfZtP3zq0V6zyRBhQuFl0ZxdD24qmQgnxxRxcQxLSbhgiTgGr7z2t5711lx64cDuulFhmJDUHxv/HH+PQUtRP3jSO/T8sXfcL/+l2/XMrgdHxyamzXBtXzqmpZNhSQvpEESO2g95Ce6bqzesHk+OhhNeUgFDWBEPNRsMZ3X3jdiea2kYDjNS6Qgr4fGiX77zeK3v+baz6z+8eDWCZ+hs3ZMwpndhHMc/NziYL8GuzbEmr7jmflvgze6hvGAo4oXzIxazISffpPGDSRljL5mxoA+80uBNo6vUyliMlAkmQJxdrLKENRt2X20oD5zs7C/CU/t2bAy8ePrSERhHFwA0kjY4yBY6W/v7R6rWhbZVFgcvDt82ADDXobN2uPajMlsOmxT0ybplhdEwfkYY3aaSXGqRmcl9sgk5WOpqA0u5ik3UmnxaEwzPs/aCbLraadWdH7rdipaQFjgEmLand5azxVajPsLM6fuHx/GH/kBu2ewoMmnDTNAsYjIZKY1UOaKYzEdC+kzVZepdBdRbPTeohYV5/cOVqykApwXGepjIRMqWJQDGjrnSN712DmmWZbNwu3l7TiMQMc8aK62JBnWc61W63dPmLokCfnNyjso3Z/PHLXLPCcuWrfWuQotjtTnuBuwQC0Sk2mdfk2+k1NhwXOeHJqOJagkXLO9SBA6yBsypZTtQTqJ5EoFTU0NAwApiQEHzKmXOIaQaAJR0A9KQeC+7UeS6WloZADI85o+NCcdKpEQWHC+hmigdkTWcSVmNqgUHwcBt0h/ijok8SINDtMTDi5YYHZFZ1P9AQ0CmAlFwiBXIMscjJbIIGtAQO2m1rNKrGhyjgDlEQiyyZkXLaMme+pKYraqaOVZkTnQZjIDUKweOV05LUHfU7Kn4hoDw7McQheSM0sxRsxdKFxxkPwITDM2PQPwmy5z/m4agWFZlU92Dt/CwXUmcM3LV50ckJW/kECdBlFqB4RvkVrh7Qe4ZrdViQff22Nn+zyyoPYV54gUz32SQmglGqIriHFWCc7Z/nJtgTCFgvEfBpE7KMgftDjYHMkiKPbZ8WtXMQbbg+0OUjDrzY8XFLixVQKxjr3ZaJQMoPvxWW/t73xgnGzdDc8KKJqVEc7hI0b0+T1ZzcFMbQOihzg2O8267Uc5DiXorPnKUi3cGRqdVBc6JrhFkDQJSlQ4wQnCOgk1OERWXTPsHR++oBphT3aPopVBTq5TUjJO8FceaO1NB8Fodg6PTXwOvRKNH0mmTQyD0ZJ1gvxVrc6gco37FA0Mm2wdj2wjbVtg8sNHooWHMsroTV8IkGfqZpppiT72rUPSB0z03OHHj862V1vDdEBiUiabaYu7c8FggJh24kQgZT3VR0X9etIuZXFJ9Fz0XaEvb0zudKQXuF68PUt/d7VpxiSgO+tS5US6Rxlq4VELNg4TAoVTAMTLpOAaHvAmKgYPlieHnnnggZec4M8JsfSWwpfuTW1Tnxz5q+2Yb9bB0uTclsJhWEFPcjUtRSaNHWwSb9Op1WXY+E8cH9aBBvA5hyfGNDz+l1hea7jl7MIZ55b1r1L9vzBAT8nPnQD+pPghnkBkY3c8BgPj+qZJs1FCsXeF16IsGHE6KLpvg/29QeyAotOCPAeVGgEX2g00VMTC6IXbA2cJz9ArM6vl4DKPiyUCYj46598dJR88rVv3Ee469PYQrLpqUa0rEvFqwIMSvdkKnrUItwhgC2ze8dlUloMOQaGOONRkIcQBVO/M5DUKWEbPC3Ouw4gU3/l/qAE5sbQttHVHGhHWleq80dGaK5FztvCArtgcSCzGA7mMuQNsHHb99wccBhPaO5cdURfqV2nidKbNxC34+AGWvMP5JSyzgwQ+MphwNaI0HOxufZl7wByNYF/kXzIIFRNC2AQJItVUWUYcuXJ20wNjegDH6UsY5S2moSyDOrQ9BAFm/sWBFCnUq8f5jNAfbL/zvTsYX+YmnOwLAeLEEgmK31PV1FEuYWYrWZ1H8YgAC/3n7xf5w/QoFeOD6HdQeTm8AmKOSEXIGQUIXhouBzRgG4EDQtrFohjRWOjAUS4xbYEDtRDR512inEhblpFZIuHrOYqkU++kl28dEhKdk04e7CJSHbA38wISzjzqFrODzH0Gs0ktC+uMKvKlH4papdEsW9/S/MwQ0MSZ0kX2v0qrd3Wj/FWAAX9HYzlk1Q1cAAAAASUVORK5CYII=';
export default img;
